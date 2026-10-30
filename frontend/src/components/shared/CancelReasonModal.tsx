"use client";

import { Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";

interface CancelReasonModalProps {
  isOpen: boolean;
  title?: string;
  bookingNumber?: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const CancelReasonModal = ({
  isOpen,
  title = "Cancel booking",
  bookingNumber,
  isLoading = false,
  onConfirm,
  onCancel,
}: CancelReasonModalProps) => {
  const [reason, setReason] = useState("Cancelled by admin");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {bookingNumber ? (
                <>
                  This will cancel booking{" "}
                  <span className="font-mono font-bold text-rose-700">
                    #{bookingNumber}
                  </span>{" "}
                  and release seats. This action cannot be undone.
                </>
              ) : (
                "This action cannot be undone. Seats will be released."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">
            Reason (optional)
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Why is this booking being cancelled?"
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim() || "Cancelled by admin")}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-4 text-xs font-bold text-white shadow-md shadow-rose-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Cancel booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReasonModal;
