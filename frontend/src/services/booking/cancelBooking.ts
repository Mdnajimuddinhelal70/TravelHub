"use server";
import { serverFetch } from "@/lib/server-fetch";

export async function cancelBooking(bookingId: string, reason?: string) {
  try {
    const res = await serverFetch.patch(`/booking/${bookingId}/status`, {
      body: JSON.stringify({
        status: "CANCELLED",
        cancellationReason: reason || "Cancelled by user",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    return {
      success: res.ok && result.success,
      message: result.message || "Done",
    };
  } catch (e: unknown) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed",
    };
  }
}
