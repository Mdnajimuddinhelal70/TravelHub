"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";

export interface ISuperAdminStats {
  bookings: { total: number; pending: number; confirmed: number };
  revenue: { total: number; thisMonth: number };
  users: {
    total: number;
    admins: number;
    superAdmins: number;
    guides: number;
    regularUsers: number;
  };
  tours: { total: number; published: number };
  departures: { total: number; open: number };
  recentBookings: Array<{
    _id: string;
    bookingNumber: string;
    status: string;
    createdAt: string;
    priceBreakdown: { total: number };
    tour?: { title: string; slug: string } | string;
    user?: { name: string; email: string } | string;
  }>;
  adminsList: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    picture?: string;
    isActive: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    picture?: string;
    createdAt: string;
  }>;
}

export async function getSuperAdminStats(): Promise<ISuperAdminStats | null> {
  try {
    const res = await serverFetch.get("/admin/super-admin-stats");
    const result = (await res.json()) as ApiResponse<ISuperAdminStats>;

    if (!res.ok || !result.success) return null;

    return result.data;
  } catch {
    return null;
  }
}
