import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  // The adapter's TypeScript definition is incompatible with
  // Cloudinary SDK v2's uploader callback types.
  cloudinary: cloudinaryUpload as unknown as ConstructorParameters<
    typeof CloudinaryStorage
  >[0]["cloudinary"],

  params: {
    public_id: (_req, file) => {
      // Example: My Special.Image#!@.png
      // Result: unique-id-timestamp-my-special-image-png

      const originalName = file.originalname.toLowerCase();

      const fileName = originalName
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const extension = file.originalname.split(".").pop()?.toLowerCase();

      const uniqueId = Math.random().toString(36).substring(2);

      const uniqueFileName = [uniqueId, Date.now(), fileName || "upload"].join(
        "-",
      );

      return extension ? `${uniqueFileName}.${extension}` : uniqueFileName;
    },
  },
});

export const multerUpload = multer({
  storage,
});
