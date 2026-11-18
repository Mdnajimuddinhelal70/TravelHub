"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import type { ApiResponse } from "@/types";
import type { IAiTripPlan, IAiTripPlanInput } from "@/types/ai.interface";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export interface GenerateTripPlanState {
  success: boolean;
  message: string;
  plan?: IAiTripPlan;
}

export async function generateTripPlan(
  input: IAiTripPlanInput,
): Promise<GenerateTripPlanState> {
  try {
    const accessToken = await getCookie("accessToken");

    const res = await fetch(`${BACKEND_API_URL}/ai/plan-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(input),
    });

    const result = (await res.json()) as ApiResponse<IAiTripPlan>;

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to generate trip plan",
      };
    }

    return {
      success: true,
      message: "Trip plan generated!",
      plan: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
