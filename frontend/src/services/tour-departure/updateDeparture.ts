"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITourDeparture } from "@/types";

export interface UpdateDeparturePayload {
  startDate?: string;
  endDate?: string;
  pricePerPerson?: number;
  totalSeats?: number;
  minGroupSize?: number;
  status?: string;
  guide?: string;
  meetingPoint?: string;
  notes?: string;
  cancellationReason?: string;
}

export async function updateDeparture(
  departureId: string,
  payload: UpdateDeparturePayload,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.patch(`/tour-departure/${departureId}`, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = (await res.json()) as ApiResponse<ITourDeparture>;

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update departure",
      };
    }

    return { success: true, message: "Departure updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
