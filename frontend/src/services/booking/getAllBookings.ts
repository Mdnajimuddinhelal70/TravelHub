"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IBooking, PaginationMeta } from "@/types";

export interface BookingListFilters {
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export async function getAllBookings(
  filters: BookingListFilters = {},
): Promise<{ bookings: IBooking[]; meta?: PaginationMeta }> {
  try {
    const query: Record<string, string> = {
      page: filters.page ?? "1",
      limit: filters.limit ?? "15",
      sort: filters.sort ?? "-createdAt",
    };

    if (filters.search) query.search = filters.search;
    if (filters.status) query.status = filters.status;

    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/booking?${qs}`);
    const result = (await res.json()) as ApiResponse<IBooking[]>;

    if (!res.ok || !result.success) {
      return { bookings: [] };
    }

    return {
      bookings: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch {
    return { bookings: [] };
  }
}
