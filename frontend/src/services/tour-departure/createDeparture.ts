"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, ITourDeparture } from "@/types";

export interface DepartureActionState {
  success: boolean;
  message: string;
  departure?: ITourDeparture;
}

export interface CreateDeparturePayload {
  tour: string;
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  totalSeats: number;
  minGroupSize?: number;
  status?: string;
  guide?: string;
  meetingPoint?: string;
  notes?: string;
}

export async function createDeparture(
  payload: CreateDeparturePayload,
): Promise<DepartureActionState> {
  try {
    const res = await serverFetch.post("/tour-departure/create", {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = (await res.json()) as ApiResponse<ITourDeparture>;

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to create departure",
      };
    }

    return {
      success: true,
      message: "Departure created successfully",
      departure: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
