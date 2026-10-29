import {
  BookOpen,
  Calendar,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { getAdminStats } from "@/services/admin/getAdminStats";

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
    case "FAILED":
    case "EXPIRED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const AdminDashboardPage = async () => {
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        Failed to load dashboard stats. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Overview of your Travel Hub platform.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value={formatPrice(stats.revenue.total)}
          sublabel="From paid bookings"
          accent="emerald"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Total Bookings"
          value={stats.bookings.total.toString()}
          sublabel={`${stats.bookings.pending} pending · ${stats.bookings.confirmed} confirmed`}
          accent="sky"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Users"
          value={stats.users.total.toString()}
          sublabel={`${stats.users.admins} admins`}
          accent="violet"
        />
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Total Tours"
          value={stats.tours.total.toString()}
          sublabel={`${stats.tours.published} published`}
          accent="amber"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Departures"
          value={stats.departures.total.toString()}
          sublabel={`${stats.departures.open} open for booking`}
          accent="rose"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Conversion"
          value={
            stats.bookings.total > 0
              ? `${Math.round(
                  (stats.bookings.confirmed / stats.bookings.total) * 100,
                )}%`
              : "—"
          }
          sublabel="Confirmed / total bookings"
          accent="indigo"
        />
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">
            Recent Bookings
          </h2>
          <Link
            href="/admin/dashboard/booking-management"
            className="text-xs font-bold text-sky-700 hover:underline"
          >
            View all →
          </Link>
        </div>

        {stats.recentBookings.length > 0 ? (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentBookings.map((b) => {
                  const tour =
                    typeof b.tour === "object" && b.tour !== null
                      ? b.tour
                      : null;
                  const user =
                    typeof b.user === "object" && b.user !== null
                      ? b.user
                      : null;

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
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {tour?.title ?? "—"}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-sm text-slate-500">
            No bookings yet.
          </p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  sublabel,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  accent: "emerald" | "sky" | "violet" | "amber" | "rose" | "indigo";
}) => {
  const accentClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-extrabold text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{sublabel}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
