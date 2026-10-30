"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface DestinationActionState {
  success: boolean;
  message: string;
  destinationId?: string;
}

export interface CreateDestinationInput {
  name: string;
  division: string;
  description?: string;
  isActive?: boolean;
  thumbnailFile?: File;
}

export async function createDestination(
  input: CreateDestinationInput,
): Promise<DestinationActionState> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const formData = new FormData();
    formData.append("name", input.name.trim());
    formData.append("division", input.division);
    if (input.description) formData.append("description", input.description);
    if (input.isActive !== undefined)
      formData.append("isActive", String(input.isActive));
    if (input.thumbnailFile) formData.append("thumbnail", input.thumbnailFile);

    const res = await fetch(`${BACKEND_API_URL}/destination/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to create destination",
      };
    }

    return {
      success: true,
      message: "Destination created successfully",
      destinationId: result.data?._id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
