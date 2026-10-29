"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface UpdateTourState {
  success: boolean;
  message: string;
  tourId?: string;
}

export async function updateTour(
  tourId: string,
  formData: FormData,
): Promise<UpdateTourState> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${BACKEND_API_URL}/tour/${tourId}`, {
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
        message: result.message || "Failed to update tour",
      };
    }

    return {
      success: true,
      message: "Tour updated successfully",
      tourId: result.data?._id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
