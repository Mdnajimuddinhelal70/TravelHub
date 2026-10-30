import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DestinationService } from "./destination.service";

/* ============================================================
 *  HELPER — parse multipart body
 * ============================================================ */
const parseBody = (body: Record<string, unknown>) => {
  const parsed = { ...body };

  if (parsed.isActive !== undefined) {
    parsed.isActive = parsed.isActive === "true" || parsed.isActive === true;
  }
  if (typeof parsed.location === "string" && parsed.location.trim()) {
    try {
      parsed.location = JSON.parse(parsed.location);
    } catch {}
  }

  return parsed;
};

/* ============================================================
 *  CREATE
 * ============================================================ */
const createDestination = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const thumbnail = files?.thumbnail?.[0]?.path;
  const images = files?.images?.map((f) => f.path) ?? [];

  const payload: Record<string, unknown> = {
    ...parseBody(req.body),
    thumbnail,
    images,
  };

  const result = await DestinationService.createDestination(payload as any);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Destination created successfully",
    data: result,
  });
});

/* ============================================================
 *  GET ALL
 * ============================================================ */
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

/* ============================================================
 *  GET BY DIVISION
 * ============================================================ */
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

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
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

/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDestination = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const payload: Record<string, unknown> = parseBody(req.body);

  // Only override if new files sent
  if (files?.thumbnail?.[0]?.path) {
    payload.thumbnail = files.thumbnail[0].path;
  }
  if (files?.images && files.images.length > 0) {
    payload.images = files.images.map((f) => f.path);
  }

  const result = await DestinationService.updateDestination(id, payload as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination updated successfully",
    data: result,
  });
});

/* ============================================================
 *  DELETE
 * ============================================================ */
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
