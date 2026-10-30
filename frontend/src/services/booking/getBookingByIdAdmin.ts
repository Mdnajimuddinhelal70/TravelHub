"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IBooking } from "@/types";

export async function getBookingByIdAdmin(
  bookingId: string,
): Promise<IBooking | null> {
  try {
    const res = await serverFetch.get(`/booking/${bookingId}`);
    const result = (await res.json()) as ApiResponse<IBooking>;

    if (!res.ok || !result.success) return null;

    return result.data;
  } catch {
    return null;
  }
}
