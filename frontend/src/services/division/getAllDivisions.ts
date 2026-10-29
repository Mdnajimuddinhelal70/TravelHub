"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IDivision, PaginationMeta } from "@/types";

export async function getAllDivisions(
  query: Record<string, string> = {},
): Promise<{ divisions: IDivision[]; meta?: PaginationMeta }> {
  try {
    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/division${qs ? `?${qs}` : ""}`);
    const result = (await res.json()) as ApiResponse<IDivision[]>;

    if (!res.ok || !result.success) {
      return { divisions: [] };
    }

    return {
      divisions: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch {
    return { divisions: [] };
  }
}
