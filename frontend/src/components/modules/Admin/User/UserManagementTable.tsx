"use client";

import {
  Ban,
  Eye,
  Loader2,
  Search,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/shared/ConfirmModal";
import { adminDeleteUser } from "@/services/user/adminDeleteUser";
import {
  AdminUserRole,
  AdminUserStatus,
  adminUpdateUser,
} from "@/services/user/adminUpdateUser";
import type { IUserListItem, UserRole } from "@/services/user/getAllUsers";

import type { PaginationMeta } from "@/types";
import RoleChangeModal from "./RoleChangeModal";

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

interface Props {
  users: IUserListItem[];
  meta?: PaginationMeta;
  currentUserRole: UserRole;
}

const UserManagementTable = ({ users, meta, currentUserRole }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [roleModalUser, setRoleModalUser] = useState<IUserListItem | null>(
    null,
  );
  const [confirmAction, setConfirmAction] = useState<{
    userId: string;
    userName: string;
    action: "block" | "unblock" | "delete";
  } | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentRole = searchParams.get("role") ?? "";
  const currentStatus = searchParams.get("isActive") ?? "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/admin/dashboard/user-management?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", searchInput.trim());
  };

  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  // Permission checks
  const canManageUser = (u: IUserListItem) => {
    if (u.role === "SUPER_ADMIN") return false; // nobody except super admin themselves
    if (u.role === "ADMIN" && !isSuperAdmin) return false; // only super admin manages admins
    return true;
  };

  const executeRoleChange = (newRole: AdminUserRole) => {
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
  };

  const executeStatusToggle = (newStatus: AdminUserStatus) => {
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

  const executeDelete = () => {
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

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/dashboard/user-management?${params.toString()}`);
  };

  const getConfirmContent = () => {
    if (!confirmAction)
      return { title: "", message: "", label: "", variant: "danger" as const };

    switch (confirmAction.action) {
      case "block":
        return {
          title: "Block user",
          message: `Block "${confirmAction.userName}"? They won't be able to log in until unblocked.`,
          label: "Block user",
          variant: "danger" as const,
        };
      case "unblock":
        return {
          title: "Unblock user",
          message: `Unblock "${confirmAction.userName}"? They'll be able to log in again.`,
          label: "Unblock user",
          variant: "primary" as const,
        };
      case "delete":
        return {
          title: "Delete user",
          message: `Delete "${confirmAction.userName}"? This is a soft delete and cannot be easily undone.`,
          label: "Delete user",
          variant: "danger" as const,
        };
    }
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
              placeholder="Search by name, email, phone..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </form>

          <div className="flex gap-2">
            <select
              value={currentRole}
              onChange={(e) => updateQuery("role", e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All roles</option>
              <option value="USER">User</option>
              <option value="GUIDE">Guide</option>
              <option value="ADMIN">Admin</option>
              {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
            </select>

            <select
              value={currentStatus}
              onChange={(e) => updateQuery("isActive", e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isUpdating = updatingId === u._id && isPending;
                    const manageable = canManageUser(u);
                    const isBlocked = u.isActive === "BLOCKED";

                    return (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-xs font-extrabold text-sky-700">
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
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {u.name}
                              </p>
                              <p className="truncate text-[11px] text-slate-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getRoleStyle(
                              u.role,
                            )}`}
                          >
                            {u.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                              u.isActive,
                            )}`}
                          >
                            {u.isActive}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/user-management/${u._id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {manageable && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setRoleModalUser(u)}
                                  disabled={isUpdating}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  title="Change role"
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      userId: u._id,
                                      userName: u.name,
                                      action: isBlocked ? "unblock" : "block",
                                    })
                                  }
                                  disabled={isUpdating}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
                                      userId: u._id,
                                      userName: u.name,
                                      action: "delete",
                                    })
                                  }
                                  disabled={isUpdating}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="text-sm font-semibold text-slate-700">
                No users found
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

      {/* Role change modal */}
      <RoleChangeModal
        isOpen={!!roleModalUser}
        userName={roleModalUser?.name ?? ""}
        currentRole={roleModalUser?.role ?? "USER"}
        isLoading={isPending && roleModalUser !== null}
        onConfirm={executeRoleChange}
        onCancel={() => setRoleModalUser(null)}
      />

      {/* Confirm modal — block/unblock/delete */}
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
            executeDelete();
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

export default UserManagementTable;
