"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function adminHardDeleteUser(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.delete(`/user/${userId}/permanent`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to permanently delete user",
      };
    }

    return { success: true, message: "User permanently deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}