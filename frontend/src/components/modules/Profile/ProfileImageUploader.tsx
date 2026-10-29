"use client";

import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { uploadProfilePicture } from "@/services/user/uploadProfilePicture";

interface Props {
  currentPicture?: string;
  userName: string;
}

const ProfileImageUploader = ({ currentPicture, userName }: Props) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentPicture);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProfilePicture(formData);

      if (result.success) {
        toast.success(result.message);
        setPreview(result.picture); // real Cloudinary URL
        router.refresh();
      } else {
        toast.error(result.message);
        setPreview(currentPicture); // rollback
      }
    } catch {
      toast.error("Upload failed");
      setPreview(currentPicture);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-3xl font-extrabold text-sky-700 ring-4 ring-white shadow-lg">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            (userName?.charAt(0) || "U").toUpperCase()
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Change profile picture"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{userName}</p>
        <p className="mt-1 text-xs text-slate-500">
          Click the camera icon to update. JPG/PNG up to 5MB.
        </p>
        {isUploading && (
          <p className="mt-1 text-[11px] font-semibold text-sky-600">
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;
