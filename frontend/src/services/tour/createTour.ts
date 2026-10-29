"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface CreateTourState {
  success: boolean;
  message: string;
  tourId?: string;
  errors?: Record<string, string[]>;
}

export async function createTour(formData: FormData): Promise<CreateTourState> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${BACKEND_API_URL}/tour/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to create tour",
        errors: result.errorSources ? { _: [result.message] } : undefined,
      };
    }

    return {
      success: true,
      message: "Tour created successfully",
      tourId: result.data?._id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
