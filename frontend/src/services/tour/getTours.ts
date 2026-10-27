"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITour } from "@/types";

export async function getTours(
  query: Record<string, string> = {},
): Promise<{ tours: ITour[]; meta?: ApiResponse<ITour[]>["meta"] }> {
  try {
    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/tour${qs ? `?${qs}` : ""}`);
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
