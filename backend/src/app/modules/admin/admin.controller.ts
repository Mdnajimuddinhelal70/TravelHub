import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await AdminService.getStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin stats retrieved successfully",
    data: stats,
  });
});

export const AdminController = {
  getStats,
};
