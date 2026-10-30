"use client";

import { Loader2, Shield, X } from "lucide-react";
import { useState } from "react";

import type { AdminUserRole } from "@/services/user/adminUpdateUser";

interface Props {
  isOpen: boolean;
  userName: string;
  currentRole: string;
  isLoading?: boolean;
  onConfirm: (role: AdminUserRole) => void;
  onCancel: () => void;
}

const RoleChangeModal = ({
  isOpen,
  userName,
  currentRole,
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) => {
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>(
    currentRole as AdminUserRole,
  );

  if (!isOpen) return null;

  const roles: { value: AdminUserRole; label: string; description: string }[] =
    [
      {
        value: "USER",
        label: "User",
        description: "Regular customer — can book tours",
      },
      {
        value: "GUIDE",
        label: "Guide",
        description: "Tour guide — can book tours like a user",
      },
      {
        value: "ADMIN",
        label: "Admin",
        description: "Can manage tours, bookings, divisions, destinations",
      },
    ];

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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Change user role
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Update role for{" "}
              <span className="font-bold text-slate-800">{userName}</span>
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

        <div className="mt-4 space-y-2">
          {roles.map((r) => (
            <label
              key={r.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                selectedRole === r.value
                  ? "border-sky-400 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-200"
              } ${currentRole === r.value ? "opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={selectedRole === r.value}
                onChange={() => setSelectedRole(r.value)}
                disabled={currentRole === r.value}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{r.label}</p>
                <p className="text-xs text-slate-600">{r.description}</p>
                {currentRole === r.value && (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Current role
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedRole)}
            disabled={isLoading || selectedRole === currentRole}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update role"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
