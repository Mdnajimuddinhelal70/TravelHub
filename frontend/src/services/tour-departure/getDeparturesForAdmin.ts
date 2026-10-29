"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITourDeparture } from "@/types";

export async function getDeparturesForAdmin(
  tourId: string,
): Promise<ITourDeparture[]> {
  try {
    const res = await serverFetch.get(
      `/tour-departure/tour/${tourId}?limit=100&sort=startDate`,
    );
    const result = (await res.json()) as ApiResponse<ITourDeparture[]>;

    if (!res.ok || !result.success) return [];

    return Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
}
