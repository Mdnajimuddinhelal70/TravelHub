"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, PaginationMeta } from "@/types";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "GUIDE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface IUserListItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  picture?: string;
  role: UserRole;
  isActive: UserStatus;
  isDeleted?: boolean;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListFilters {
  search?: string;
  role?: string;
  isActive?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export async function getAllUsers(
  filters: UserListFilters = {},
): Promise<{ users: IUserListItem[]; meta?: PaginationMeta }> {
  try {
    const query: Record<string, string> = {
      page: filters.page ?? "1",
      limit: filters.limit ?? "15",
      sort: filters.sort ?? "-createdAt",
    };

    if (filters.search) query.search = filters.search;
    if (filters.role) query.role = filters.role;
    if (filters.isActive) query.isActive = filters.isActive;

    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/user/all-users?${qs}`);
    const result = (await res.json()) as ApiResponse<IUserListItem[]>;

    if (!res.ok || !result.success) {
      return { users: [] };
    }

    return {
      users: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch {
    return { users: [] };
  }
}
