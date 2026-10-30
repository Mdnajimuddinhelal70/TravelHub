"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function deleteDestination(
  destinationId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.delete(`/destination/${destinationId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete destination",
      };
    }

    return { success: true, message: "Destination deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}