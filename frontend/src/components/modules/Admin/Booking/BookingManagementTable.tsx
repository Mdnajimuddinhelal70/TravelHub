"use client";

import {
  CheckCircle2,
  CircleCheck,
  Eye,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import CancelReasonModal from "@/components/shared/CancelReasonModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import {
  AdminBookingStatus,
  adminUpdateBookingStatus,
} from "@/services/booking/adminUpdateBookingStatus";
import type { IBooking, PaginationMeta } from "@/types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getStatusStyle = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "COMPLETED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "FAILED":
    case "EXPIRED":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

interface Props {
  bookings: IBooking[];
  meta?: PaginationMeta;
}

interface PendingAction {
  bookingId: string;
  bookingNumber: string;
  status: AdminBookingStatus;
}

const BookingManagementTable = ({ bookings, meta }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [pendingConfirm, setPendingConfirm] = useState<PendingAction | null>(
    null,
  );
  const [pendingCancel, setPendingCancel] = useState<PendingAction | null>(
    null,
  );

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/admin/dashboard/booking-management?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", searchInput.trim());
  };

  const executeStatusChange = (
    bookingId: string,
    newStatus: AdminBookingStatus,
    reason?: string,
  ) => {
    setUpdatingId(bookingId);
    startTransition(async () => {
      const result = await adminUpdateBookingStatus(
        bookingId,
        newStatus,
        reason,
      );
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
      setPendingConfirm(null);
      setPendingCancel(null);
    });
  };

  const requestConfirm = (booking: IBooking) => {
    setPendingConfirm({
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      status: "CONFIRMED",
    });
  };

  const requestComplete = (booking: IBooking) => {
    setPendingConfirm({
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      status: "COMPLETED",
    });
  };

  const requestCancel = (booking: IBooking) => {
    setPendingCancel({
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      status: "CANCELLED",
    });
  };

  const confirmMessages: Record<string, { title: string; message: string }> = {
    CONFIRMED: {
      title: "Confirm booking",
      message:
        "This will confirm the booking and notify the customer. Make sure payment has been received.",
    },
    COMPLETED: {
      title: "Mark booking as completed",
      message:
        "This indicates the tour has been completed. The customer won't be able to cancel after this.",
    },
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/dashboard/booking-management?${params.toString()}`);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by booking # or customer..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </form>

          <select
            value={currentStatus}
            onChange={(e) => updateQuery("status", e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:max-w-[200px]"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED">Failed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Booking #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Tour</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => {
                    const tour =
                      typeof b.tour === "object" && b.tour !== null
                        ? b.tour
                        : null;
                    const user =
                      typeof b.user === "object" && b.user !== null
                        ? b.user
                        : null;

                    const isUpdating = updatingId === b._id && isPending;
                    const canConfirm = b.status === "PENDING";
                    const canComplete = b.status === "CONFIRMED";
                    const canCancel =
                      b.status === "PENDING" || b.status === "CONFIRMED";

                    return (
                      <tr key={b._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-[11px] font-semibold text-sky-700">
                          #{b.bookingNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-slate-800">
                            {user?.name ?? "—"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {user?.email ?? ""}
                          </p>
                          {user?.phone && (
                            <p className="text-[10px] text-slate-500">
                              {user.phone}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700">
                            {tour?.title ?? "—"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {b.guestCount} traveler
                            {b.guestCount !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900">
                          {formatPrice(b.priceBreakdown.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                              b.status,
                            )}`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDate(b.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/booking-management/${b._id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {canConfirm && (
                              <button
                                type="button"
                                onClick={() => requestConfirm(b)}
                                disabled={isUpdating}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                title="Confirm"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}

                            {canComplete && (
                              <button
                                type="button"
                                onClick={() => requestComplete(b)}
                                disabled={isUpdating}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                                title="Mark completed"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CircleCheck className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => requestCancel(b)}
                                disabled={isUpdating}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                title="Cancel"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No bookings found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-600">
                Page {meta.page} of {meta.totalPage} · {meta.total} total
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(meta.page + 1)}
                  disabled={meta.page >= meta.totalPage}
                  className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!pendingConfirm}
        title={
          pendingConfirm
            ? (confirmMessages[pendingConfirm.status]?.title ?? "")
            : ""
        }
        message={
          pendingConfirm
            ? `#${pendingConfirm.bookingNumber} — ${
                confirmMessages[pendingConfirm.status]?.message ?? ""
              }`
            : ""
        }
        confirmLabel={
          pendingConfirm?.status === "CONFIRMED"
            ? "Confirm booking"
            : "Mark completed"
        }
        variant="primary"
        isLoading={isPending && pendingConfirm !== null}
        onConfirm={() => {
          if (!pendingConfirm) return;
          executeStatusChange(pendingConfirm.bookingId, pendingConfirm.status);
        }}
        onCancel={() => setPendingConfirm(null)}
      />

      {/* Cancel Reason Modal */}
      <CancelReasonModal
        isOpen={!!pendingCancel}
        bookingNumber={pendingCancel?.bookingNumber}
        isLoading={isPending && pendingCancel !== null}
        onConfirm={(reason) => {
          if (!pendingCancel) return;
          executeStatusChange(pendingCancel.bookingId, "CANCELLED", reason);
        }}
        onCancel={() => setPendingCancel(null)}
      />
    </>
  );
};

export default BookingManagementTable;
