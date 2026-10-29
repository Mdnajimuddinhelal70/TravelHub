import { Request, Response } from "express";
import { Types } from "mongoose";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour, ITourType } from "./tour.interface";
import { TourService } from "./tour.service";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const parseJSON = <T>(val: unknown, fallback: T): T => {
    if (typeof val !== "string") return (val as T) ?? fallback;
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  };

  const body = req.body as Record<string, unknown>;

  const payload = {
    title: String(body.title ?? ""),
    description: body.description ? String(body.description) : undefined,
    coverImage: files[0]?.path,
    images: files.map((file) => file.path),
    destinations: parseJSON<string[]>(
      body.destinations,
      [],
    ) as unknown as Types.ObjectId[],
    primaryDestination: body.primaryDestination
      ? (String(body.primaryDestination) as unknown as Types.ObjectId)
      : undefined,
    tourType: String(body.tourType ?? "") as unknown as Types.ObjectId,
    category: body.category
      ? (String(body.category) as ITour["category"])
      : undefined,
    difficulty: body.difficulty
      ? (String(body.difficulty) as ITour["difficulty"])
      : undefined,
    duration: parseJSON(body.duration, { days: 1, nights: 0 }),
    price: parseJSON(body.price, { adult: 0 }),
    included: parseJSON<string[]>(body.included, []),
    excluded: parseJSON<string[]>(body.excluded, []),
    amenities: parseJSON<string[]>(body.amenities, []),
    tourPlan: parseJSON(body.tourPlan, []),
    minGroupSize: body.minGroupSize ? Number(body.minGroupSize) : undefined,
    maxGuest: body.maxGuest ? Number(body.maxGuest) : undefined,
    minAge: body.minAge ? Number(body.minAge) : undefined,
    cancellationPolicy: body.cancellationPolicy
      ? String(body.cancellationPolicy)
      : undefined,
    status: body.status ? (String(body.status) as ITour["status"]) : "draft",
    rating: 0,
    totalReviews: 0,
  };

  const result = await TourService.createTour(payload as unknown as ITour);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTours(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await TourService.getSingleTour(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour retrieved successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const body = req.body as Record<string, unknown>;

  const parseJSON = <T>(val: unknown, fallback: T): T => {
    if (typeof val !== "string") return (val as T) ?? fallback;
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  };

  const payload: Record<string, unknown> = {};

  // Only set fields that exist
  if (body.title !== undefined) payload.title = String(body.title);
  if (body.description !== undefined)
    payload.description = String(body.description);
  if (body.category !== undefined)
    payload.category = body.category ? String(body.category) : undefined;
  if (body.difficulty !== undefined)
    payload.difficulty = body.difficulty ? String(body.difficulty) : undefined;
  if (body.status !== undefined) payload.status = String(body.status);
  if (body.cancellationPolicy !== undefined)
    payload.cancellationPolicy = String(body.cancellationPolicy);
  if (body.tourType !== undefined) payload.tourType = String(body.tourType);

  if (body.destinations !== undefined) {
    payload.destinations = parseJSON<string[]>(body.destinations, []);
  }
  if (body.primaryDestination !== undefined) {
    payload.primaryDestination = body.primaryDestination
      ? String(body.primaryDestination)
      : null;
  }
  if (body.duration !== undefined) {
    payload.duration = parseJSON(body.duration, { days: 1, nights: 0 });
  }
  if (body.price !== undefined) {
    payload.price = parseJSON(body.price, { adult: 0 });
  }
  if (body.included !== undefined) {
    payload.included = parseJSON<string[]>(body.included, []);
  }
  if (body.excluded !== undefined) {
    payload.excluded = parseJSON<string[]>(body.excluded, []);
  }
  if (body.amenities !== undefined) {
    payload.amenities = parseJSON<string[]>(body.amenities, []);
  }
  if (body.tourPlan !== undefined) {
    payload.tourPlan = parseJSON(body.tourPlan, []);
  }
  if (body.minGroupSize !== undefined)
    payload.minGroupSize = body.minGroupSize
      ? Number(body.minGroupSize)
      : undefined;
  if (body.maxGuest !== undefined)
    payload.maxGuest = body.maxGuest ? Number(body.maxGuest) : undefined;
  if (body.minAge !== undefined)
    payload.minAge = body.minAge ? Number(body.minAge) : undefined;

  // New images
  if (files.length > 0) {
    payload.images = files.map((file) => file.path);
  }

  // deleteImages
  if (body.deleteImages) {
    payload.deleteImages = Array.isArray(body.deleteImages)
      ? body.deleteImages
      : [body.deleteImages];
  }

  const result = await TourService.updateTour(
    req.params.id as string,
    payload as Partial<ITour> & { deleteImages?: string[] },
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const payload: ITourType = req.body;
  const result = await TourService.createTourType(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TourService.getSingleTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload: Partial<ITourType> = req.body; // ✅ পুরো object
  const result = await TourService.updateTourType(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  createTourType,
  getAllTourTypes,
  getSingleTourType,
  deleteTourType,
  updateTourType,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
