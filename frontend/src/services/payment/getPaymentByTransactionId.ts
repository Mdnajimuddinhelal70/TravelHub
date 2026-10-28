"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IBooking, IPayment } from "@/types";

export interface IPaymentWithBooking extends Omit<IPayment, "booking"> {
  booking: IBooking;
}

export async function getPaymentByTransactionId(
  transactionId: string,
): Promise<IPaymentWithBooking | null> {
  try {
    const res = await serverFetch.get(
      `/payment/by-transaction/${transactionId}`,
    );
    const result = (await res.json()) as ApiResponse<IPaymentWithBooking>;

    if (!res.ok || !result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}
