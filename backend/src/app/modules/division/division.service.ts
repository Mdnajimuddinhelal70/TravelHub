import httpStatus from "http-status-codes";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Destination } from "../destination/destination.model";
import { Tour } from "../tour/tour.model";
import { divisionSearchableFields } from "./division.constant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

/* ============================================================
 *  HELPER — slug generator
 * ============================================================ */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0980-\u09FF\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/* ============================================================
 *  CREATE
 * ============================================================ */
const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division with this name already exists.",
    );
  }

  if (!payload.slug) {
    payload.slug = generateSlug(payload.name);
  }

  const existingSlug = await Division.findOne({ slug: payload.slug });
  if (existingSlug) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division with this slug already exists.",
    );
  }

  return await Division.create(payload);
};

/* ============================================================
 *  GET ALL (paginated)
 * ============================================================ */
const getAllDivisions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Division.find({ isDeleted: false }),
    query,
  );

  const divisionsData = queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    divisionsData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug, isDeleted: false });
  if (!division) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found.");
  }
  return { data: division };
};

/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision || existingDivision.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found.");
  }

  // name বদলালে duplicate check + slug regenerate
  if (payload.name && payload.name !== existingDivision.name) {
    const duplicateDivision = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (duplicateDivision) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A division with this name already exists.",
      );
    }

    if (!payload.slug) {
      payload.slug = generateSlug(payload.name);
    }
  }

  // slug explicitly দিলে uniqueness check
  if (payload.slug && payload.slug !== existingDivision.slug) {
    const duplicateSlug = await Division.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (duplicateSlug) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A division with this slug already exists.",
      );
    }
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // নতুন thumbnail এলে পুরনোটা Cloudinary থেকে মুছুন
  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCLoudinary(existingDivision.thumbnail);
  }

  return updatedDivision;
};

/* ============================================================
 *  DELETE (soft + referential check)
 * ============================================================ */
const deleteDivision = async (id: string) => {
  const division = await Division.findById(id);
  if (!division || division.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found.");
  }

  // ✅ referential integrity
  const [destinationCount, tourCount] = await Promise.all([
    Destination.countDocuments({ division: id, isDeleted: false }),
    Tour.countDocuments({ destinations: id, isDeleted: false }),
  ]);

  if (destinationCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot delete division. ${destinationCount} destination(s) are using it.`,
    );
  }
  if (tourCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot delete division. ${tourCount} tour(s) are using it.`,
    );
  }

  await Division.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true },
  );

  if (division.thumbnail) {
    await deleteImageFromCLoudinary(division.thumbnail);
  }

  return null;
};

export const DivisionService = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
