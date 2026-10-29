"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface UpdateProfileState {
  success: boolean;
  message: string;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; address?: string; picture?: string },
): Promise<UpdateProfileState> {
  try {
    const res = await serverFetch.patch(`/user/${userId}`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update profile",
      };
    }

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
