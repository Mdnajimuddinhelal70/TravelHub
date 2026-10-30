"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface UpdateDestinationInput {
  name?: string;
  division?: string;
  description?: string;
  isActive?: boolean;
  thumbnailFile?: File;
}

export async function updateDestination(
  destinationId: string,
  input: UpdateDestinationInput,
): Promise<{ success: boolean; message: string }> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const formData = new FormData();
    if (input.name) formData.append("name", input.name.trim());
    if (input.division) formData.append("division", input.division);
    if (input.description !== undefined)
      formData.append("description", input.description);
    if (input.isActive !== undefined)
      formData.append("isActive", String(input.isActive));
    if (input.thumbnailFile) formData.append("thumbnail", input.thumbnailFile);

    const res = await fetch(`${BACKEND_API_URL}/destination/${destinationId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update destination",
      };
    }

    return { success: true, message: "Destination updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
