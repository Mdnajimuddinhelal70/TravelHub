"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_v2_1 = require("multer-storage-cloudinary-v2");
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_v2_1.CloudinaryStorage({
    // The adapter's TypeScript definition is incompatible with
    // Cloudinary SDK v2's uploader callback types.
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        public_id: (_req, file) => {
            // Example: My Special.Image#!@.png
            // Result: unique-id-timestamp-my-special-image-png
            var _a;
            const originalName = file.originalname.toLowerCase();
            const fileName = originalName
                .replace(/\.[^.]+$/, "")
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            const extension = (_a = file.originalname.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const uniqueId = Math.random().toString(36).substring(2);
            const uniqueFileName = [uniqueId, Date.now(), fileName || "upload"].join("-");
            return extension ? `${uniqueFileName}.${extension}` : uniqueFileName;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({
    storage,
});
