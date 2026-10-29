import { CreditCard } from "lucide-react";
import Link from "next/link";

import { getMyBookings } from "@/services/booking/getMyBookings";
import type { IBooking, IPayment } from "@/types";

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

const getPaymentStyle = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "FAILED":
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "REFUNDED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const PaymentHistoryPage = async () => {
  const { bookings } = await getMyBookings({ sort: "-createdAt" });

  // Only bookings that have a populated payment object
  const payments = bookings
    .filter(
      (b): b is IBooking & { payment: IPayment } =>
        typeof b.payment === "object" &&
        b.payment !== null &&
        "status" in b.payment,
    )
    .map((b) => ({ booking: b, payment: b.payment }));

  const totalPaid = payments
    .filter((p) => p.payment.status === "PAID")
    .reduce((sum, p) => sum + p.payment.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Payment History
        </h1>
        <p className="text-sm text-slate-600">
          All your tour payments and invoices in one place.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total paid
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {formatPrice(totalPaid)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total transactions
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {payments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Successful
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">
            {payments.filter((p) => p.payment.status === "PAID").length}
          </p>
        </div>
      </div>

      {/* Table */}
      {payments.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(({ booking, payment }) => (
                <tr key={payment._id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-sky-700">
                    #{booking.bookingNumber}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                    {payment.transactionId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getPaymentStyle(
                        payment.status,
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/my-bookings/${booking._id}`}
                      className="text-xs font-bold text-sky-700 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-16 text-center">
          <CreditCard className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-lg font-bold text-slate-900">
            No payments yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Once you book and pay for a tour, your transactions will appear
            here.
          </p>
          <Link
            href="/tours"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md"
          >
            Browse tours
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
