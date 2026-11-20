"use server";

import { serverFetch } from "@/lib/server-fetch";

interface ResetPasswordInput {
  id: string;
  token: string;
  newPassword: string;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.post("/auth/reset-password", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
      };
    }

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
