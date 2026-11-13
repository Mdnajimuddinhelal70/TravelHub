import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Sparkles,
  TrendingUp,
  User,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  calculateUserStats,
  getDaysUntil,
  getUpcomingTrip,
} from "@/lib/dashboard-helpers";
import { getMyBookings } from "@/services/booking/getMyBookings";
import { getMe } from "@/services/user/getMe";

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

const UserDashboardPage = async () => {
  const user = await getMe();
  if (!user) redirect("/login");

  const { bookings } = await getMyBookings({ sort: "-createdAt" });

  const stats = calculateUserStats(bookings);
  const upcomingTrip = getUpcomingTrip(bookings);
  const recentBookings = bookings.slice(0, 3);

  const firstName = user.name?.split(" ")[0] ?? "Traveler";

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-violet-600 p-6 text-white shadow-2xl shadow-sky-500/20 sm:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome back
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Hi {firstName}! 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            {upcomingTrip
              ? `Your next adventure is ${getDaysUntil(
                  typeof upcomingTrip.tourDeparture === "object" &&
                    upcomingTrip.tourDeparture !== null
                    ? upcomingTrip.tourDeparture.startDate
                    : "",
                )} days away. Get ready!`
              : "Ready to explore the world? Let's find your next adventure."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tours"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-sky-700 shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <MapPin className="h-4 w-4" />
              Browse tours
            </Link>
            <Link
              href="/dashboard/my-bookings"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Calendar className="h-4 w-4" />
              My bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Total Bookings"
          value={stats.totalBookings.toString()}
          sublabel={`${stats.pendingBookings} pending`}
          accent="sky"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Active Trips"
          value={stats.activeBookings.toString()}
          sublabel="Confirmed upcoming"
          accent="emerald"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Spent"
          value={formatPrice(stats.totalSpent)}
          sublabel="Across all trips"
          accent="violet"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Completed Trips"
          value={stats.completedTrips.toString()}
          sublabel="Memories made"
          accent="amber"
        />
      </div>

      {/* Upcoming Trip */}
      {upcomingTrip && (
        <section className="overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
            {/* Tour image */}
            {(() => {
              const tour =
                typeof upcomingTrip.tour === "object" &&
                upcomingTrip.tour !== null
                  ? upcomingTrip.tour
                  : null;
              const dep =
                typeof upcomingTrip.tourDeparture === "object" &&
                upcomingTrip.tourDeparture !== null
                  ? upcomingTrip.tourDeparture
                  : null;

              if (!tour) return null;

              const daysUntil = dep ? getDaysUntil(dep.startDate) : null;

              return (
                <>
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-48">
                    {tour.coverImage ? (
                      <Image
                        src={tour.coverImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <MapPin className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                          <Sparkles className="h-3 w-3" />
                          Upcoming Trip
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {tour.title}
                        </h3>
                        <p className="font-mono text-[11px] text-sky-700">
                          #{upcomingTrip.bookingNumber}
                        </p>
                      </div>

                      {daysUntil !== null && daysUntil > 0 && (
                        <div className="shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-3 py-2 text-center text-white shadow-lg">
                          <p className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">
                            In
                          </p>
                          <p className="text-xl font-black leading-none">
                            {daysUntil}
                          </p>
                          <p className="text-[9px] font-bold opacity-80">
                            {daysUntil === 1 ? "day" : "days"}
                          </p>
                        </div>
                      )}
                    </div>

                    {dep && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-sky-600" />
                          {formatDate(dep.startDate)} —{" "}
                          {formatDate(dep.endDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <UsersRound className="h-3.5 w-3.5 text-sky-600" />
                          {upcomingTrip.guestCount} traveler
                          {upcomingTrip.guestCount !== 1 ? "s" : ""}
                        </span>
                        {dep.meetingPoint && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-sky-600" />
                            {dep.meetingPoint}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatPrice(upcomingTrip.priceBreakdown.total)}
                      </p>

                      <Link
                        href={`/dashboard/my-bookings/${upcomingTrip._id}`}
                        className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        View details
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* Recent Bookings + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Bookings */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <Clock3 className="h-4 w-4 text-sky-600" />
              Recent Bookings
            </h2>
            <Link
              href="/dashboard/my-bookings"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="mt-4 space-y-2">
              {recentBookings.map((booking) => {
                const tour =
                  typeof booking.tour === "object" && booking.tour !== null
                    ? booking.tour
                    : null;
                const dep =
                  typeof booking.tourDeparture === "object" &&
                  booking.tourDeparture !== null
                    ? booking.tourDeparture
                    : null;

                return (
                  <Link
                    key={booking._id}
                    href={`/dashboard/my-bookings/${booking._id}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-sky-200 hover:bg-sky-50/50"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {tour?.coverImage ? (
                        <Image
                          src={tour.coverImage}
                          alt={tour.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {tour?.title ?? "Tour"}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {dep
                          ? `${formatDate(dep.startDate)} — ${formatDate(dep.endDate)}`
                          : "—"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatPrice(booking.priceBreakdown.total)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                No bookings yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Start exploring our curated tours.
              </p>
              <Link
                href="/tours"
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md"
              >
                Browse tours
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <QuickAction
              href="/tours"
              icon={<MapPin className="h-5 w-5" />}
              title="Browse Tours"
              description="Find your next trip"
              accent="sky"
            />
            <QuickAction
              href="/dashboard/my-bookings"
              icon={<Calendar className="h-5 w-5" />}
              title="My Bookings"
              description="View all bookings"
              accent="violet"
            />
            <QuickAction
              href="/dashboard/payment-history"
              icon={<CreditCard className="h-5 w-5" />}
              title="Payment History"
              description="Invoices & payments"
              accent="emerald"
            />
            <QuickAction
              href="/dashboard/my-profile"
              icon={<User className="h-5 w-5" />}
              title="My Profile"
              description="Update your info"
              accent="amber"
            />
          </div>
        </section>
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
  accent: "sky" | "emerald" | "violet" | "amber";
}) => {
  const accentClasses = {
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-1.5 truncate text-2xl font-extrabold text-slate-950">
            {value}
          </p>
          <p className="mt-1 truncate text-[11px] text-slate-500">{sublabel}</p>
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

const QuickAction = ({
  href,
  icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "sky" | "violet" | "emerald" | "amber";
}) => {
  const accentClasses = {
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${accentClasses[accent]}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-600" />
    </Link>
  );
};

export default UserDashboardPage;
