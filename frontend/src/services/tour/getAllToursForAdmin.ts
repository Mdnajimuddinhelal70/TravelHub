"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITour, PaginationMeta } from "@/types";

export interface TourListFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export async function getAllToursForAdmin(
  filters: TourListFilters = {},
): Promise<{ tours: ITour[]; meta?: PaginationMeta }> {
  try {
    const query: Record<string, string> = {
      page: filters.page ?? "1",
      limit: filters.limit ?? "10",
      sort: filters.sort ?? "-createdAt",
    };

    if (filters.search) query.search = filters.search;
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;

    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/tour?${qs}`);
    const result = (await res.json()) as ApiResponse<ITour[]>;

    if (!res.ok || !result.success) {
      return { tours: [] };
    }

    return {
      tours: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch {
    return { tours: [] };
  }
}
