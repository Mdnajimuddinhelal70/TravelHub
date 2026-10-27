import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour, ITourType } from "./tour.interface";
import { TourService } from "./tour.service";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const payload: ITour = {
    ...req.body,
    images: files.map((file) => file.path),
  };
  const result = await TourService.createTour(payload);
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

  const payload: Partial<ITour> & { deleteImages?: string[] } = {
    ...req.body,
  };

  if (files.length > 0) {
    payload.images = files.map((file) => file.path);
  }

  if (req.body.deleteImages) {
    payload.deleteImages = Array.isArray(req.body.deleteImages)
      ? req.body.deleteImages
      : [req.body.deleteImages];
  }

  const result = await TourService.updateTour(req.params.id as string, payload);
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
