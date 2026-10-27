import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ITourDeparture } from "./tour-departure.interface";
import { TourDepartureService } from "./tourDeparture.service";

/* ============================================================
 *  CREATE
 * ============================================================ */
const createTourDeparture = catchAsync(async (req: Request, res: Response) => {
  const payload: ITourDeparture = req.body;
  const result = await TourDepartureService.createTourDeparture(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour departure created successfully",
    data: result,
  });
});

/* ============================================================
 *  GET ALL
 * ============================================================ */
const getAllTourDepartures = catchAsync(async (req: Request, res: Response) => {
  const result = await TourDepartureService.getAllTourDepartures(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour departures retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

/* ============================================================
 *  GET BY TOUR
 * ============================================================ */
const getDeparturesByTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.tourId as string;
  const result = await TourDepartureService.getDeparturesByTour(
    tourId,
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour departures retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleTourDeparture = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await TourDepartureService.getSingleTourDeparture(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour departure retrieved successfully",
      data: result,
    });
  },
);

/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateTourDeparture = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload: Partial<ITourDeparture> = req.body;
  const result = await TourDepartureService.updateTourDeparture(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour departure updated successfully",
    data: result,
  });
});

/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteTourDeparture = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TourDepartureService.deleteTourDeparture(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour departure deleted successfully",
    data: result,
  });
});

export const TourDepartureController = {
  createTourDeparture,
  getAllTourDepartures,
  getDeparturesByTour,
  getSingleTourDeparture,
  updateTourDeparture,
  deleteTourDeparture,
};
