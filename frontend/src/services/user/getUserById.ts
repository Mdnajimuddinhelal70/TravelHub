"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";
import type { IUserListItem } from "./getAllUsers";

export interface IUserDetail extends IUserListItem {
  address?: string;
  auths?: { provider: string; providerId: string }[];
}

export async function getUserById(id: string): Promise<IUserDetail | null> {
  try {
    const res = await serverFetch.get(`/user/${id}`);
    const result = (await res.json()) as ApiResponse<IUserDetail>;

    if (!res.ok || !result.success) return null;

    return result.data ?? null;
  } catch {
    return null;
  }
}
