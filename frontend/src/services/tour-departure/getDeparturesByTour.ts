"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITourDeparture } from "@/types";

export async function getDeparturesByTour(
  tourId: string,
  query: Record<string, string> = {},
): Promise<ITourDeparture[]> {
  try {
    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(
      `/tour-departure/tour/${tourId}${qs ? `?${qs}` : ""}`,
    );
    const result = (await res.json()) as ApiResponse<ITourDeparture[]>;

    if (!res.ok || !result.success) {
      return [];
    }

    return Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
}
