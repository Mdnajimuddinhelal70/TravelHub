"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IDestination, PaginationMeta } from "@/types";

export async function getAllDestinations(
  query: Record<string, string> = {},
): Promise<{ destinations: IDestination[]; meta?: PaginationMeta }> {
  try {
    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/destination${qs ? `?${qs}` : ""}`);
    const result = (await res.json()) as ApiResponse<IDestination[]>;

    if (!res.ok || !result.success) {
      return { destinations: [] };
    }

    return {
      destinations: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch {
    return { destinations: [] };
  }
}