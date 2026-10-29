import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";
import { DivisionService } from "./division.service";

/* ============================================================
 *  CREATE
 * ============================================================ */
const createDivision = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  let districts: string[] | undefined;

  if (body.districts) {
    try {
      districts = JSON.parse(body.districts);
    } catch {
      districts = body.districts.split(",").map((s: string) => s.trim());
    }
  }
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
    districts,
  };
  const result = await DivisionService.createDivision(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created successfully",
    data: result,
  });
});

/* ============================================================
 *  GET ALL
 * ============================================================ */
const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division retrieved successfully",
    data: result.data,
  });
});

/* ============================================================
 *  UPDATE
 * ============================================================ */
const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload: Partial<IDivision> = { ...req.body };

  // ✅ file না থাকলে thumbnail field-এ হাত দেবেন না
  if (req.file?.path) {
    payload.thumbnail = req.file.path;
  }

  const result = await DivisionService.updateDivision(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division updated successfully",
    data: result,
  });
});

/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await DivisionService.deleteDivision(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division deleted successfully",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
