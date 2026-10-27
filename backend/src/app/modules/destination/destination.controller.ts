import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DestinationService } from "./destination.service";

const createDestination = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const payload = {
    ...req.body,
    thumbnail: req.file?.path ?? req.body.thumbnail,
    images: files.length > 0 ? files.map((f) => f.path) : req.body.images,
  };
  const result = await DestinationService.createDestination(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Destination created successfully",
    data: result,
  });
});

const getAllDestinations = catchAsync(async (req: Request, res: Response) => {
  const result = await DestinationService.getAllDestinations(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destinations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getDestinationsByDivision = catchAsync(
  async (req: Request, res: Response) => {
    const divisionId = req.params.divisionId as string;
    const result = await DestinationService.getDestinationsByDivision(
      divisionId,
      req.query as Record<string, string>,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Destinations retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleDestination = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await DestinationService.getSingleDestination(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination retrieved successfully",
    data: result.data,
  });
});

const updateDestination = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  const payload: Record<string, unknown> = { ...req.body };
  if (req.file?.path) {
    payload.thumbnail = req.file.path;
  }
  if (files.length > 0) {
    payload.images = files.map((f) => f.path);
  }

  const result = await DestinationService.updateDestination(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination updated successfully",
    data: result,
  });
});

const deleteDestination = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await DestinationService.deleteDestination(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination deleted successfully",
    data: result,
  });
});

export const DestinationController = {
  createDestination,
  getAllDestinations,
  getDestinationsByDivision,
  getSingleDestination,
  updateDestination,
  deleteDestination,
};
