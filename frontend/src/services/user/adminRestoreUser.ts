"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function adminRestoreUser(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.patch(`/user/${userId}/restore`, {
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to restore user",
      };
    }

    return { success: true, message: "User restored successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}