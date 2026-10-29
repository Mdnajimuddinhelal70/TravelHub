"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface UploadPictureState {
  success: boolean;
  message: string;
  picture?: string;
}

export async function uploadProfilePicture(
  formData: FormData,
): Promise<UploadPictureState> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${BACKEND_API_URL}/user/me/profile-picture`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to upload picture",
      };
    }

    return {
      success: true,
      message: "Profile picture updated",
      picture: result.data?.picture,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
