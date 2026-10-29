"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";

export interface IAdminStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  revenue: {
    total: number;
  };
  users: {
    total: number;
    admins: number;
  };
  tours: {
    total: number;
    published: number;
  };
  departures: {
    total: number;
    open: number;
  };
  recentBookings: Array<{
    _id: string;
    bookingNumber: string;
    status: string;
    createdAt: string;
    priceBreakdown: { total: number };
    tour?: { title: string; slug: string } | string;
    user?: { name: string; email: string } | string;
  }>;
}

export async function getAdminStats(): Promise<IAdminStats | null> {
  try {
    const res = await serverFetch.get("/admin/stats");
    const result = (await res.json()) as ApiResponse<IAdminStats>;

    if (!res.ok || !result.success) return null;

    return result.data;
  } catch {
    return null;
  }
}
