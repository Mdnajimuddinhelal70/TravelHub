import httpStatus from "http-status-codes";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Division } from "../division/division.model";
import { Tour } from "../tour/tour.model";
import { destinationSearchableFields } from "./destination.constant";
import { IDestination } from "./destination.interface";
import { Destination } from "./destination.model";

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
 *  HELPER — division validate
 * ============================================================ */
const ensureDivisionExists = async (divisionId: string) => {
  const division = await Division.findOne({
    _id: divisionId,
    isDeleted: false,
  });
  if (!division) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found.");
  }
};

/* ============================================================
 *  CREATE
 * ============================================================ */
const createDestination = async (payload: IDestination) => {
  // name duplicate
  const existingDestination = await Destination.findOne({
    name: payload.name,
    isDeleted: false,
  });
  if (existingDestination) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A destination with this name already exists.",
    );
  }

  // division exist করে?
  await ensureDivisionExists(payload.division.toString());

  // slug auto-generate
  if (!payload.slug) {
    payload.slug = generateSlug(payload.name);
  }

  // slug duplicate
  const existingSlug = await Destination.findOne({ slug: payload.slug });
  if (existingSlug) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A destination with this slug already exists.",
    );
  }

  return await Destination.create(payload);
};

/* ============================================================
 *  GET ALL (paginated)
 * ============================================================ */
const getAllDestinations = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Destination.find({ isDeleted: false }),
    query,
  );

  const destinationsData = queryBuilder
    .search(destinationSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    destinationsData.build().populate("division", "name slug thumbnail"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

/* ============================================================
 *  GET BY DIVISION
 * ============================================================ */
const getDestinationsByDivision = async (
  divisionId: string,
  query: Record<string, string>,
) => {
  await ensureDivisionExists(divisionId);

  const queryBuilder = new QueryBuilder(
    Destination.find({ division: divisionId, isDeleted: false }),
    query,
  );

  const destinationsData = queryBuilder
    .search(destinationSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    destinationsData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDestination = async (slug: string) => {
  const destination = await Destination.findOne({
    slug,
    isDeleted: false,
  }).populate("division", "name slug thumbnail");

  if (!destination) {
    throw new AppError(httpStatus.NOT_FOUND, "Destination not found.");
  }
  return { data: destination };
};

/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDestination = async (
  id: string,
  payload: Partial<IDestination>,
) => {
  const existingDestination = await Destination.findById(id);
  if (!existingDestination || existingDestination.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Destination not found.");
  }

  if (payload.name && payload.name !== existingDestination.name) {
    const duplicateName = await Destination.findOne({
      name: payload.name,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicateName) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A destination with this name already exists.",
      );
    }

    if (!payload.slug) {
      payload.slug = generateSlug(payload.name);
    }
  }

  if (payload.slug && payload.slug !== existingDestination.slug) {
    const duplicateSlug = await Destination.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (duplicateSlug) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A destination with this slug already exists.",
      );
    }
  }

  if (payload.division) {
    await ensureDivisionExists(payload.division.toString());
  }

  const updatedDestination = await Destination.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.thumbnail && existingDestination.thumbnail) {
    await deleteImageFromCLoudinary(existingDestination.thumbnail);
  }

  return updatedDestination;
};

/* ============================================================
 *  DELETE (soft + referential check)
 * ============================================================ */
const deleteDestination = async (id: string) => {
  const destination = await Destination.findById(id);
  if (!destination || destination.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Destination not found.");
  }

  const tourCount = await Tour.countDocuments({
    destinations: id,
    isDeleted: false,
  });
  if (tourCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot delete destination. ${tourCount} tour(s) are using it.`,
    );
  }

  await Destination.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true },
  );

  if (destination.thumbnail) {
    await deleteImageFromCLoudinary(destination.thumbnail);
  }

  return null;
};

export const DestinationService = {
  createDestination,
  getAllDestinations,
  getDestinationsByDivision,
  getSingleDestination,
  updateDestination,
  deleteDestination,
};
