"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IBooking } from "@/types";

export type AdminBookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface AdminStatusUpdateState {
  success: boolean;
  message: string;
  booking?: IBooking;
}

export async function adminUpdateBookingStatus(
  bookingId: string,
  status: AdminBookingStatus,
  cancellationReason?: string,
): Promise<AdminStatusUpdateState> {
  try {
    const body: Record<string, unknown> = { status };
    if (cancellationReason) body.cancellationReason = cancellationReason;

    const res = await serverFetch.patch(`/booking/${bookingId}/status`, {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const result = (await res.json()) as ApiResponse<IBooking>;

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update booking status",
      };
    }

    return {
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
