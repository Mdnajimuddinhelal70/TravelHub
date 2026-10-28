"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse } from "@/types";

export async function getInvoiceDownloadUrl(
  paymentId: string,
): Promise<string | null> {
  try {
    const res = await serverFetch.get(`/payment/invoice/${paymentId}`);
    const result = (await res.json()) as ApiResponse<string>;

    if (!res.ok || !result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}
