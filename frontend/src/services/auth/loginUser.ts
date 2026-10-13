"use server";

import {
  getDefaultDashboardRoute,
  isUserRole,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { setCookie } from "@/services/auth/tokenHandlers";
import { redirect } from "next/navigation";

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      role?: unknown;
    };
  };
}

export const loginUser = async (_currentState: unknown, formData: FormData) => {
  try {
    const loginData = {
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") ?? ""),
    };

    if (!loginData.email || !loginData.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = (await res.json()) as LoginResponse;

    if (!res.ok || !result.success || !result.data?.accessToken) {
      return {
        success: false,
        message: result.message || "Login failed. Please try again.",
      };
    }

    const { accessToken, refreshToken, user } = result.data;
    const role = user?.role;

    // Never assume USER when the backend role is missing or invalid.
    if (!isUserRole(role)) {
      console.error("Login response contains an invalid user role.");

      return {
        success: false,
        message: "Unable to verify your account role. Please contact support.",
      };
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    await setCookie("accessToken", accessToken, cookieOptions);

    if (refreshToken) {
      await setCookie("refreshToken", refreshToken, cookieOptions);
    }

    const requestedRedirect = String(formData.get("redirect") ?? "");

    const safeRedirect =
      requestedRedirect && isValidRedirectForRole(requestedRedirect, role)
        ? requestedRedirect
        : "";

    const destination =
      safeRedirect || getDefaultDashboardRoute(role as UserRole);

    redirect(destination);
  } catch (error: unknown) {
    // Next.js redirect() throws a special control-flow error.
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Login action failed:", error);

    return {
      success: false,
      message: "Login failed. Please check your credentials and try again.",
    };
  }
};
