"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITour } from "@/types";

export async function getTourForEdit(idOrSlug: string): Promise<ITour | null> {
  try {
    const res = await serverFetch.get(`/tour/${idOrSlug}`);
    const result = (await res.json()) as ApiResponse<ITour>;

    if (!res.ok || !result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}
