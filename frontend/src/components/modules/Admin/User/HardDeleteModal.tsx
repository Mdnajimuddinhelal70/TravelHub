"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  userName: string;
  userEmail: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const HardDeleteModal = ({
  isOpen,
  userName,
  userEmail,
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) => {
  const [confirmation, setConfirmation] = useState("");

  if (!isOpen) return null;

  const isConfirmed = confirmation === "DELETE";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-rose-700">
              Permanently delete user?
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This will remove{" "}
              <span className="font-bold text-slate-900">{userName}</span> (
              {userEmail}) from the database forever.{" "}
              <span className="font-bold text-rose-700">
                This cannot be undone.
              </span>
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

        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
          <p className="text-[11px] font-bold text-rose-800">
            ⚠️ This action is irreversible. Users with existing bookings cannot
            be permanently deleted.
          </p>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">
            Type{" "}
            <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-rose-700">
              DELETE
            </span>{" "}
            to confirm
          </span>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Type DELETE"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            autoFocus
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
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
            onClick={onConfirm}
            disabled={isLoading || !isConfirmed}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-700 px-4 text-xs font-bold text-white shadow-md shadow-rose-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardDeleteModal;
