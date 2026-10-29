"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ChangePasswordState {
  success: boolean;
  message: string;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<ChangePasswordState> {
  try {
    const res = await serverFetch.post("/auth/change-password", {
      body: JSON.stringify({ oldPassword, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to change password",
      };
    }

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
