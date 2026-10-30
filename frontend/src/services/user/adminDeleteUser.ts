"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function adminDeleteUser(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.patch(`/user/${userId}`, {
      body: JSON.stringify({ isDeleted: true }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete user",
      };
    }
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
