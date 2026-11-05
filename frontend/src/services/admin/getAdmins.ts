"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, PaginationMeta } from "@/types";
import type { IUserListItem } from "@/services/user/getAllUsers";

export async function getAdmins(
  filters: Record<string, string> = {},
): Promise<{ admins: IUserListItem[]; meta?: PaginationMeta }> {
  try {
    const query: Record<string, string> = {
      page: filters.page ?? "1",
      limit: filters.limit ?? "15",
      sort: filters.sort ?? "-createdAt",
    };

    if (filters.search) query.search = filters.search;
    if (filters.isActive) query.isActive = filters.isActive;

    // Fetch both ADMIN and SUPER_ADMIN
    const [adminRes, superAdminRes] = await Promise.all([
      serverFetch.get(
        `/user/all-users?${new URLSearchParams({
          ...query,
          role: "ADMIN",
          page: "1",
          limit: "100",
        }).toString()}`,
      ),
      serverFetch.get(
        `/user/all-users?${new URLSearchParams({
          ...query,
          role: "SUPER_ADMIN",
          page: "1",
          limit: "100",
        }).toString()}`,
      ),
    ]);

    const [adminJson, superAdminJson] = await Promise.all([
      adminRes.json() as Promise<ApiResponse<IUserListItem[]>>,
      superAdminRes.json() as Promise<ApiResponse<IUserListItem[]>>,
    ]);

    const admins: IUserListItem[] = [
      ...(adminJson.success ? (adminJson.data ?? []) : []),
      ...(superAdminJson.success ? (superAdminJson.data ?? []) : []),
    ];

    // Sort by role (SUPER_ADMIN first), then createdAt
    admins.sort((a, b) => {
      if (a.role === "SUPER_ADMIN" && b.role !== "SUPER_ADMIN") return -1;
      if (b.role === "SUPER_ADMIN" && a.role !== "SUPER_ADMIN") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      admins,
      meta: adminJson.meta ?? superAdminJson.meta,
    };
  } catch {
    return { admins: [] };
  }
}