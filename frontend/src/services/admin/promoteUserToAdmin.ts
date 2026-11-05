"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function promoteUserToAdmin(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.patch(`/user/${userId}`, {
      body: JSON.stringify({ role: "ADMIN" }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to promote user",
      };
    }

    return { success: true, message: "User promoted to ADMIN" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
