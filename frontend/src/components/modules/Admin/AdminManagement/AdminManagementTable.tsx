"use client";

import {
  Ban,
  Crown,
  Eye,
  Loader2,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import RoleChangeModal from "@/components/modules/Admin/User/RoleChangeModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { adminDeleteUser } from "@/services/user/adminDeleteUser";
import { adminUpdateUser } from "@/services/user/adminUpdateUser";

import type { IUserListItem, UserRole } from "@/services/user/getAllUsers";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getRoleStyle = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "ADMIN":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

interface Props {
  admins: IUserListItem[];
  currentUserRole: UserRole;
}

const AdminManagementTable = ({ admins, currentUserRole }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [roleModalUser, setRoleModalUser] = useState<IUserListItem | null>(
    null,
  );
  const [confirmAction, setConfirmAction] = useState<{
    userId: string;
    userName: string;
    action: "block" | "unblock" | "delete" | "demote";
  } | null>(null);

  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  const filtered = admins.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  });

  const canManage = (admin: IUserListItem) => {
    if (admin.role === "SUPER_ADMIN") return false; // nobody manages super admin
    if (!isSuperAdmin) return false; // only super admin manages admins
    return true;
  };

  const executeStatusToggle = (newStatus: "ACTIVE" | "BLOCKED") => {
    if (!confirmAction) return;
    setUpdatingId(confirmAction.userId);
    startTransition(async () => {
      const result = await adminUpdateUser(confirmAction.userId, {
        isActive: newStatus,
      });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
      setConfirmAction(null);
    });
  };

  const executeDemote = () => {
    if (!confirmAction) return;
    setUpdatingId(confirmAction.userId);
    startTransition(async () => {
      const result = await adminUpdateUser(confirmAction.userId, {
        role: "USER",
      });
      if (result.success) {
        toast.success("Admin demoted to USER");
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
      setConfirmAction(null);
    });
  };

  const executeSoftDelete = () => {
    if (!confirmAction) return;
    setUpdatingId(confirmAction.userId);
    startTransition(async () => {
      const result = await adminDeleteUser(confirmAction.userId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
      setConfirmAction(null);
    });
  };

  const getConfirmContent = () => {
    if (!confirmAction)
      return { title: "", message: "", label: "", variant: "danger" as const };

    switch (confirmAction.action) {
      case "block":
        return {
          title: "Block admin",
          message: `Block "${confirmAction.userName}"? They won't be able to log in.`,
          label: "Block",
          variant: "danger" as const,
        };
      case "unblock":
        return {
          title: "Unblock admin",
          message: `Unblock "${confirmAction.userName}"?`,
          label: "Unblock",
          variant: "primary" as const,
        };
      case "demote":
        return {
          title: "Demote to USER",
          message: `Remove admin privileges from "${confirmAction.userName}"?`,
          label: "Demote",
          variant: "danger" as const,
        };
      case "delete":
        return {
          title: "Soft delete admin",
          message: `Soft-delete "${confirmAction.userName}"? They can be restored later.`,
          label: "Delete",
          variant: "danger" as const,
        };
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admins by name or email..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <Link
            href="/admin/dashboard/user-management"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            Promote from Users
          </Link>
        </div>

        {/* Info banner */}
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm">
          <p className="font-semibold text-sky-900">🛡 Admin Management</p>
          <p className="mt-1 text-xs text-sky-800">
            Only SUPER_ADMIN can promote/demote/block admins. To promote a
            regular user to ADMIN, use{" "}
            <Link
              href="/admin/dashboard/user-management"
              className="font-bold underline"
            >
              User Management
            </Link>{" "}
            and change their role.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Admin</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((a) => {
                    const isUpdating = updatingId === a._id && isPending;
                    const manageable = canManage(a);
                    const isBlocked = a.isActive === "BLOCKED";
                    const isSuper = a.role === "SUPER_ADMIN";

                    return (
                      <tr key={a._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-extrabold ${
                                isSuper
                                  ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700"
                                  : "bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700"
                              }`}
                            >
                              {a.picture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={a.picture}
                                  alt={a.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                (a.name?.charAt(0) || "A").toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {isSuper && (
                                  <Crown className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
                                )}
                                {a.name}
                              </p>
                              <p className="truncate text-[11px] text-slate-500">
                                {a.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getRoleStyle(
                              a.role,
                            )}`}
                          >
                            {a.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${
                              isBlocked
                                ? "bg-rose-50 text-rose-700 ring-rose-200"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            }`}
                          >
                            {a.isActive}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDate(a.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/user-management/${a._id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                              title="View profile"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {manageable && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setRoleModalUser(a)}
                                  disabled={isUpdating}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
                                  title="Change role"
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      userId: a._id,
                                      userName: a.name,
                                      action: isBlocked ? "unblock" : "block",
                                    })
                                  }
                                  disabled={isUpdating}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-60 ${
                                    isBlocked
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  }`}
                                  title={isBlocked ? "Unblock" : "Block"}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : isBlocked ? (
                                    <UserCheck className="h-3.5 w-3.5" />
                                  ) : (
                                    <Ban className="h-3.5 w-3.5" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      userId: a._id,
                                      userName: a.name,
                                      action: "demote",
                                    })
                                  }
                                  disabled={isUpdating}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-700 transition hover:bg-orange-100 disabled:opacity-60"
                                  title="Demote to user"
                                >
                                  <ShieldOff className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      userId: a._id,
                                      userName: a.name,
                                      action: "delete",
                                    })
                                  }
                                  disabled={isUpdating}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
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
              <Shield className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No admins found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {searchQuery
                  ? "Try a different search term."
                  : "Promote users to admins from User Management."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role change modal */}
      <RoleChangeModal
        isOpen={!!roleModalUser}
        userName={roleModalUser?.name ?? ""}
        currentRole={roleModalUser?.role ?? "ADMIN"}
        isLoading={isPending && roleModalUser !== null}
        onConfirm={(newRole) => {
          if (!roleModalUser) return;
          setUpdatingId(roleModalUser._id);
          startTransition(async () => {
            const result = await adminUpdateUser(roleModalUser._id, {
              role: newRole,
            });
            if (result.success) {
              toast.success(result.message);
              router.refresh();
            } else {
              toast.error(result.message);
            }
            setUpdatingId(null);
            setRoleModalUser(null);
          });
        }}
        onCancel={() => setRoleModalUser(null)}
      />

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        title={getConfirmContent().title}
        message={getConfirmContent().message}
        confirmLabel={getConfirmContent().label}
        variant={getConfirmContent().variant}
        isLoading={isPending && confirmAction !== null}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.action === "delete") {
            executeSoftDelete();
          } else if (confirmAction.action === "demote") {
            executeDemote();
          } else {
            executeStatusToggle(
              confirmAction.action === "block" ? "BLOCKED" : "ACTIVE",
            );
          }
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default AdminManagementTable;
