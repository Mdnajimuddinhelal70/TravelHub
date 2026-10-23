import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  tourSearchableFields,
  tourTypeSearchableFields,
} from "./tour.constant";

import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

type UpdateTourPayload = Partial<ITour> & {
  deleteImages?: string[];
};

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({
    $or: [{ title: payload.title }, { slug: payload.slug }],
  });

  if (existingTour) {
    throw new Error("A tour with this title or slug already exists.");
  }

  return await Tour.create(payload);
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug });

  return {
    data: tour,
  };
};

const updateTour = async (id: string, payload: UpdateTourPayload) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const { deleteImages = [], images: newImages, ...updateData } = payload;

  // Use an explicitly typed update object so images can be assigned safely.
  const finalUpdateData: Partial<ITour> = { ...updateData };

  if (newImages !== undefined || deleteImages.length > 0) {
    const deletedImages = new Set(deleteImages);

    const remainingImages = (existingTour.images ?? []).filter(
      (imageUrl) => !deletedImages.has(imageUrl),
    );

    const uploadedImages = (newImages ?? []).filter(
      (imageUrl) => !deletedImages.has(imageUrl),
    );

    finalUpdateData.images = [...remainingImages, ...uploadedImages];
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
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({
    $or: [{ name: payload.name }, { slug: payload.slug }],
  });

  if (existingTourType) {
    throw new Error("A tour type with this name or slug already exists.");
  }

  return await TourType.create(payload);
};

const getAllTourTypes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const tourTypes = await queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tourTypes.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findById(id);

  return {
    data: tourType,
  };
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  if (Object.keys(payload).length === 0) {
    return existingTourType;
  }

  return await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
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
