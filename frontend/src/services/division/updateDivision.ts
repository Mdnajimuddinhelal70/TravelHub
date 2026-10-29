"use server";

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface UpdateDivisionInput {
  name?: string;
  description?: string;
  districts?: string[];
  isActive?: boolean;
  thumbnailFile?: File;
}

export async function updateDivision(
  divisionId: string,
  input: UpdateDivisionInput,
): Promise<{ success: boolean; message: string }> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const formData = new FormData();
    if (input.name) formData.append("name", input.name);
    if (input.description !== undefined)
      formData.append("description", input.description);
    if (input.districts)
      formData.append("districts", JSON.stringify(input.districts));
    if (input.isActive !== undefined)
      formData.append("isActive", String(input.isActive));
    if (input.thumbnailFile) formData.append("file", input.thumbnailFile);

    const res = await fetch(`${BACKEND_API_URL}/division/${divisionId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update division",
      };
    }

    return { success: true, message: "Division updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
