"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_model_1 = require("./user.model");
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Updated Successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Retrieved Successfully",
        data: result.data,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const user = yield user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your profile Retrieved Successfully",
        data: user,
    });
}));
const uploadProfilePicture = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No image file provided");
    }
    const newPictureUrl = req.file.path || req.file.secure_url;
    if (!newPictureUrl) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to upload image");
    }
    const userId = req.user.userId;
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const oldPicture = existingUser.picture;
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { picture: newPictureUrl }, { new: true, runValidators: true }).select("-password -auths -refreshToken");
    // ✅ পুরনো picture delete (fire and forget)
    if (oldPicture && oldPicture !== newPictureUrl) {
        (0, cloudinary_config_1.deleteImageFromCLoudinary)(oldPicture).catch((err) => console.error("Failed to delete old picture:", err));
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Profile picture updated successfully",
        data: {
            picture: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.picture,
            user: updatedUser,
        },
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    uploadProfilePicture,
};
