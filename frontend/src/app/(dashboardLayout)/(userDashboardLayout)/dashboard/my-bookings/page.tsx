import { CalendarX2 } from "lucide-react";
import Link from "next/link";

import MyBookingsList from "@/components/modules/Booking/MyBookingsList";
import { getMyBookings } from "@/services/booking/getMyBookings";

const MyBookingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const { status } = await searchParams;

  const query: Record<string, string> = { sort: "-createdAt" };
  if (status) query.status = status;

  const { bookings } = await getMyBookings(query);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          My Bookings
        </h1>
        <p className="text-sm text-slate-600">
          View and manage your tour bookings, download invoices, or cancel
          upcoming trips.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "PENDING" },
          { label: "Confirmed", value: "CONFIRMED" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Cancelled", value: "CANCELLED" },
        ].map((tab) => {
          const isActive = (status || "") === tab.value;
          const href = tab.value
            ? `/dashboard/my-bookings?status=${tab.value}`
            : "/dashboard/my-bookings";

          return (
            <Link
              key={tab.label}
              href={href}
              className={`inline-flex h-9 items-center rounded-lg border px-4 text-xs font-bold transition ${
                isActive
                  ? "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      {bookings.length > 0 ? (
        <MyBookingsList bookings={bookings} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
            <CalendarX2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No bookings found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            You haven&apos;t booked any tours yet. Start exploring our curated
            journeys and book your next adventure.
          </p>
          <Link
            href="/tours"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Explore tours
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
