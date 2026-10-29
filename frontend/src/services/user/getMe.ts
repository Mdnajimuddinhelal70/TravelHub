"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";

export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  picture?: string;
  role: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMe(): Promise<IUserProfile | null> {
  try {
    const res = await serverFetch.get("/user/me");
    const result = (await res.json()) as ApiResponse<IUserProfile>;

    if (!res.ok || !result.success) return null;

    return result.data;
  } catch {
    return null;
  }
}
