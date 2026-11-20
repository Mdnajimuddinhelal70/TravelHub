"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ForgotPasswordState {
  success: boolean;
  message: string;
}

export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordState> {
  try {
    const res = await serverFetch.post("/auth/forgot-password", {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to send reset link",
      };
    }

    return {
      success: true,
      message: "Reset link sent! Check your email.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
