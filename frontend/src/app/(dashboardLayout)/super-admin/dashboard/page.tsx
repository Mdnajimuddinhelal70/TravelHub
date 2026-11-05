import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Crown,
  DollarSign,
  MapPin,
  Shield,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";

import { getSuperAdminStats } from "@/services/admin/getSuperAdminStats";

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

const SuperAdminDashboard = async () => {
  const stats = await getSuperAdminStats();

  if (!stats) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-8 text-white shadow-2xl shadow-violet-500/20 sm:p-10">
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
            <Crown className="h-3.5 w-3.5" />
            Super Admin Console
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">
              Owner
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
            You have full control over the Travel Hub platform. Manage admins,
            monitor revenue, and oversee every operation.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/dashboard/admin-management"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-violet-700 shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Shield className="h-4 w-4" />
              Manage admins
            </Link>
            <Link
              href="/admin/dashboard/tour-management"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" />
              Manage tours
            </Link>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value={formatPrice(stats.revenue.total)}
          sublabel={`${formatPrice(stats.revenue.thisMonth)} this month`}
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
          sublabel={`${stats.users.regularUsers} users · ${stats.users.guides} guides`}
          accent="violet"
        />
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Active Tours"
          value={stats.tours.total.toString()}
          sublabel={`${stats.tours.published} published · ${stats.departures.open} open departures`}
          accent="amber"
        />
      </div>

      {/* Admin team overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Admin team */}
        <section className="rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/50 to-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <Crown className="h-4 w-4 text-violet-600" />
              Admin Team
            </h2>
            <Link
              href="/admin/dashboard/admin-management"
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
            >
              Manage
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {stats.adminsList.length > 0 ? (
              stats.adminsList.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-violet-200 hover:shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ${
                      admin.role === "SUPER_ADMIN"
                        ? "bg-gradient-to-br from-violet-200 to-fuchsia-200 text-violet-800"
                        : "bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700"
                    }`}
                  >
                    {admin.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={admin.picture}
                        alt={admin.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (admin.name?.charAt(0) || "A").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {admin.role === "SUPER_ADMIN" && (
                        <Crown className="mr-1 inline h-3 w-3 text-amber-500" />
                      )}
                      {admin.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {admin.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                      admin.role === "SUPER_ADMIN"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {admin.role === "SUPER_ADMIN" ? "SUPER" : "ADMIN"}
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-2 py-6 text-center text-xs text-slate-500">
                No admins yet
              </p>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
          <QuickAction
            href="/admin/dashboard/admin-management"
            icon={<UserCog className="h-5 w-5" />}
            title="Admin Management"
            description="Manage admin access"
            accent="violet"
          />
          <QuickAction
            href="/admin/dashboard/user-management"
            icon={<Users className="h-5 w-5" />}
            title="User Management"
            description="Manage all platform users"
            accent="sky"
          />
          <QuickAction
            href="/admin/dashboard/booking-management"
            icon={<CalendarDays className="h-5 w-5" />}
            title="Bookings"
            description="View & manage bookings"
            accent="emerald"
          />
        </section>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent bookings */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <TrendingUp className="h-4 w-4 text-sky-600" />
              Recent Bookings
            </h2>
            <Link
              href="/admin/dashboard/booking-management"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((b) => {
                const tour =
                  typeof b.tour === "object" && b.tour !== null ? b.tour : null;
                const user =
                  typeof b.user === "object" && b.user !== null ? b.user : null;

                return (
                  <div
                    key={b._id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {user?.name ?? "—"}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {tour?.title ?? "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {formatPrice(b.priceBreakdown.total)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                          b.status,
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">
                No bookings yet
              </p>
            )}
          </div>
        </section>

        {/* Recent users */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <Users className="h-4 w-4 text-violet-600" />
              New Users
            </h2>
            <Link
              href="/admin/dashboard/user-management"
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-xs font-extrabold text-sky-700">
                    {u.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.picture}
                        alt={u.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (u.name?.charAt(0) || "U").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">
                      {u.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {u.email}
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] text-slate-500">
                    {formatDate(u.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">
                No users yet
              </p>
            )}
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
  accent: "emerald" | "sky" | "violet" | "amber";
}) => {
  const accentClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
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
  accent: "violet" | "sky" | "emerald";
}) => {
  const accentClasses = {
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
    sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]} transition`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
    </Link>
  );
};

export default SuperAdminDashboard;
