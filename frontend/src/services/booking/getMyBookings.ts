"use server";
import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IBooking } from "@/types";

export async function getMyBookings(query: Record<string, string> = {}) {
  try {
    const qs = new URLSearchParams(query).toString();
    const res = await serverFetch.get(`/booking/my-bookings${qs ? `?${qs}` : ""}`);
    const result = (await res.json()) as ApiResponse<IBooking[]>;
    if (!res.ok || !result.success) return { bookings: [], meta: undefined };
    return { bookings: result.data ?? [], meta: result.meta };
  } catch {
    return { bookings: [], meta: undefined };
  }
}