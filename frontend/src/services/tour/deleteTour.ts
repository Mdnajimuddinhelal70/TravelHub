"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

export interface DeleteTourState {
  success: boolean;
  message: string;
}

export async function deleteTour(tourId: string): Promise<DeleteTourState> {
  try {
    const res = await serverFetch.delete(`/tour/${tourId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete tour",
      };
    }

    revalidatePath("/admin/dashboard/tour-management");
    revalidatePath("/tours");
    revalidatePath("/");

    return { success: true, message: "Tour deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
