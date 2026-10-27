import httpStatus from "http-status-codes";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Destination } from "../destination/destination.model";
import {
  tourSearchableFields,
  tourTypeSearchableFields,
} from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

type UpdateTourPayload = Partial<ITour> & {
  deleteImages?: string[];
};

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0980-\u09FF\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const createTour = async (payload: ITour) => {
  // slug auto-generate
  if (!payload.slug) {
    payload.slug = generateSlug(payload.title);
  }

  const existingTour = await Tour.findOne({
    $or: [{ title: payload.title }, { slug: payload.slug }],
  });
  if (existingTour) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A tour with this title or slug already exists.",
    );
  }

  if (payload.destinations?.length) {
    const foundDestinations = await Destination.countDocuments({
      _id: { $in: payload.destinations },
    });
    if (foundDestinations !== payload.destinations.length) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "One or more destinations not found.",
      );
    }
  }

  if (payload.tourType) {
    const foundType = await TourType.findById(payload.tourType);
    if (!foundType) {
      throw new AppError(httpStatus.NOT_FOUND, "Tour type not found.");
    }
  }

  return await Tour.create(payload);
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find({ isDeleted: false }), query);

  const tours = queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours
      .build()
      .populate("destinations", "name slug thumbnail")
      .populate("tourType", "name slug icon"),
    queryBuilder.getMeta(),
  ]);
  444;
  return { data, meta };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug, isDeleted: false })
    .populate("destinations", "name slug thumbnail description")
    .populate("tourType", "name slug icon");

  if (!tour) {
    throw new Error("Tour not found.");
  }

  return tour;
};

const updateTour = async (id: string, payload: UpdateTourPayload) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour || existingTour.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found.");
  }

  const { deleteImages = [], images: newImages, ...updateData } = payload;

  const finalUpdateData: Partial<ITour> = { ...updateData };

  if (updateData.title && updateData.title !== existingTour.title) {
    const newSlug = updateData.slug || generateSlug(updateData.title);
    const duplicate = await Tour.findOne({
      _id: { $ne: id },
      $or: [{ title: updateData.title }, { slug: newSlug }],
    });
    if (duplicate) {
      throw new Error("A tour with this title or slug already exists.");
    }
    finalUpdateData.slug = newSlug;
  }

  // ✅ destinations validate
  if (updateData.destinations?.length) {
    const found = await Destination.countDocuments({
      _id: { $in: updateData.destinations },
    });
    if (found !== updateData.destinations.length) {
      throw new Error("One or more destinations not found.");
    }
  }

  // ✅ tourType validate
  if (updateData.tourType) {
    const foundType = await TourType.findById(updateData.tourType);
    if (!foundType) {
      throw new Error("Tour type not found.");
    }
  }

  // ✅ images merge logic
  if (newImages !== undefined || deleteImages.length > 0) {
    const deletedSet = new Set(deleteImages);
    const remaining = (existingTour.images ?? []).filter(
      (url) => !deletedSet.has(url),
    );
    const uploaded = (newImages ?? []).filter((url) => !deletedSet.has(url));
    finalUpdateData.images = [...remaining, ...uploaded];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, finalUpdateData, {
    new: true,
    runValidators: true,
  });

  if (deleteImages.length > 0) {
    await Promise.all(
      deleteImages.map((url) => deleteImageFromCLoudinary(url)),
    );
  }

  return updatedTour;
};

const deleteTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new Error("Tour not found.");
  }

  await Tour.findByIdAndDelete(id);

  if (tour.images?.length) {
    await Promise.all(tour.images.map((url) => deleteImageFromCLoudinary(url)));
  }

  return null;
};

const createTourType = async (payload: ITourType) => {
  // slug auto-generate
  if (!payload.slug) {
    payload.slug = generateSlug(payload.name);
  }

  const existingTourType = await TourType.findOne({
    $or: [{ name: payload.name }, { slug: payload.slug }],
  });
  if (existingTourType) {
    throw new Error("A tour type with this name or slug already exists.");
  }

  return await TourType.create(payload);
};

const getAllTourTypes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    TourType.find({ isDeleted: false }),
    query,
  );

  const tourTypes = queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tourTypes.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findOne({ _id: id, isDeleted: false });
  if (!tourType) {
    throw new Error("Tour type not found.");
  }
  return tourType;
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingTourType || existingTourType.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type not found.");
  }

  if (Object.keys(payload).length === 0) {
    return existingTourType;
  }

  if (payload.name && payload.name !== existingTourType.name) {
    const duplicate = await TourType.findOne({
      _id: { $ne: id },
      name: payload.name,
    });
    if (duplicate) {
      throw new Error("A tour type with this name already exists.");
    }
    if (!payload.slug) {
      payload.slug = generateSlug(payload.name);
    }
  }

  return await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingTourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type not found.");
  }

  const tourCount = await Tour.countDocuments({
    tourType: id,
    isDeleted: false,
  });
  if (tourCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot delete tour type. ${tourCount} tour(s) are using it.`,
    );
  }

  return await TourType.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true },
  );
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getSingleTourType,
  getSingleTour,
  getAllTours,
  updateTour,
  deleteTour,
};
