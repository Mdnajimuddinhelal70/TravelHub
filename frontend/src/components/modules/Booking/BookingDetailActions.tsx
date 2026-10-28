"use client";

import { Download, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { cancelBooking } from "@/services/booking/cancelBooking";
import { getInvoiceDownloadUrl } from "@/services/booking/getInvoiceDownloadUrl";

interface Props {
  bookingId: string;
  paymentId?: string;
  invoiceUrl?: string;
  canCancel: boolean;
}

const BookingDetailActions = ({
  bookingId,
  paymentId,
  invoiceUrl,
  canCancel,
}: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Cancel this booking? This action cannot be undone.",
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        toast.success("Booking cancelled");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel booking");
      }
    });
  };

  const handleDownloadInvoice = async () => {
    if (!paymentId) return;

    setIsDownloading(true);
    try {
      const url = invoiceUrl || (await getInvoiceDownloadUrl(paymentId));

      if (!url) {
        toast.error("Invoice not available yet");
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {paymentId && (
        <button
          type="button"
          onClick={handleDownloadInvoice}
          disabled={isDownloading}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-3.5 w-3.5" />
          {isDownloading ? "Loading..." : "Download Invoice"}
        </button>
      )}

      {canCancel && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <XCircle className="h-3.5 w-3.5" />
          {isPending ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
};

export default BookingDetailActions;
