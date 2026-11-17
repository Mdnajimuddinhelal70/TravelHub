import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AiServices } from "./ai.service";

const generateTripPlan = catchAsync(async (req: Request, res: Response) => {
  const { destination, days, budget, adults, children, interests } = req.body;

  if (!destination || !days || !budget) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "destination, days, and budget are required",
    );
  }

  const plan = await AiServices.generateTripPlan({
    destination,
    days: Number(days),
    budget: Number(budget),
    adults: Number(adults) || 1,
    children: Number(children) || 0,
    interests,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trip plan generated successfully",
    data: plan,
  });
});

export const AiControllers = {
  generateTripPlan,
};
