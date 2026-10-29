"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function deleteDivision(
  divisionId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.delete(`/division/${divisionId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete division",
      };
    }

    return { success: true, message: "Division deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
