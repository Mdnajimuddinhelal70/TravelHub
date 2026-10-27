/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import type { ApiResponse, ICreateBookingResponse, ITraveler } from "@/types";
import { createBookingSchema } from "@/zod/booking.validation";

/**
 * Server action: create a booking.
 *
 * Called from the booking form via useActionState.
 * formData structure:
 *   tourDeparture: string
 *   travelers: JSON string of ITraveler[]
 *   contactInfo: { name, phone, email, emergencyContact? }
 *   specialRequests?: string
 *   couponCode?: string
 */
export const createBooking = async (_currentState: any, formData: FormData) => {
  try {
    // --- Parse travelers (JSON string) ---
    let travelers: ITraveler[] = [];
    const travelersRaw = formData.get("travelers");

    if (typeof travelersRaw === "string" && travelersRaw.trim()) {
      try {
        travelers = JSON.parse(travelersRaw);
      } catch {
        return {
          success: false,
          message: "Invalid travelers data.",
        };
      }
    }

    // --- Parse contactInfo (JSON string) ---
    let contactInfo: Record<string, unknown> = {};
    const contactRaw = formData.get("contactInfo");

    if (typeof contactRaw === "string" && contactRaw.trim()) {
      try {
        contactInfo = JSON.parse(contactRaw);
      } catch {
        return {
          success: false,
          message: "Invalid contact information.",
        };
      }
    }

    // --- Build raw payload ---
    const rawData = {
      tourDeparture: formData.get("tourDeparture"),
      travelers,
      contactInfo,
      specialRequests: formData.get("specialRequests") || undefined,
      couponCode: formData.get("couponCode") || undefined,
    };

    // --- Validate ---
    const validationResult = zodValidator(rawData, createBookingSchema);

    if (!validationResult.success || !validationResult.data) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // --- API call ---
    const response = await serverFetch.post("/booking", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result =
      (await response.json()) as ApiResponse<ICreateBookingResponse>;

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Booking failed. Please try again.",
      };
    }

    // --- Success: return paymentUrl + booking ---
    return {
      success: true,
      message: "Booking created successfully",
      data: result.data,
      paymentUrl: result.data?.paymentUrl,
      booking: result.data?.booking,
    };
  } catch (error: any) {
    // Next.js redirect() control-flow error — re-throw
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error?.message || "Booking failed"
          : "Booking failed. Please try again.",
    };
  }
};
