"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";

export type AdminUserRole = "USER" | "ADMIN" | "GUIDE";
export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface UpdateUserInput {
  role?: AdminUserRole;
  isActive?: AdminUserStatus;
}

export interface AdminUpdateUserState {
  success: boolean;
  message: string;
}

export async function adminUpdateUser(
  userId: string,
  data: UpdateUserInput,
): Promise<AdminUpdateUserState> {
  try {
    const res = await serverFetch.patch(`/user/${userId}`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = (await res.json()) as ApiResponse<unknown>;

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update user",
      };
    }

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
