import { getUserById } from "@/services/user/getUserById";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const getRoleStyle = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "ADMIN":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "GUIDE":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "USER":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "INACTIVE":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    case "BLOCKED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const UserDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/dashboard/user-management"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to users
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-2xl font-extrabold text-sky-700 ring-4 ring-white shadow-md">
            {user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              (user.name?.charAt(0) || "U").toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getRoleStyle(
                  user.role,
                )}`}
              >
                {user.role.replace("_", " ")}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                  user.isActive,
                )}`}
              >
                {user.isActive}
              </span>
              {user.isDeleted && (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 ring-1 ring-inset ring-rose-200">
                  Deleted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contact */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <User className="h-4 w-4 text-sky-600" />
            Contact Information
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-700">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {user.email}
            </p>
            {user.phone && (
              <p className="flex items-center gap-2 text-slate-700">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {user.phone}
              </p>
            )}
            {user.address && (
              <p className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {user.address}
              </p>
            )}
          </div>
        </section>

        {/* Account info */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <Shield className="h-4 w-4 text-sky-600" />
            Account
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Role</span>
              <span className="font-bold text-slate-800">
                {user.role.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-slate-800">{user.isActive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deleted</span>
              <span className="font-bold text-slate-800">
                {user.isDeleted ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Auth providers</span>
              <span className="font-bold text-slate-800">
                {(user.auths ?? []).map((a) => a.provider).join(", ") || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* Timestamps */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <CalendarDays className="h-4 w-4 text-sky-600" />
            Account Timeline
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Joined
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDateTime(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last updated
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDateTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDetailPage;
