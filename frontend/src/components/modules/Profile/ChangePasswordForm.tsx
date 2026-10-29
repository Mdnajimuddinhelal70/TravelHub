"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { changePassword } from "@/services/auth/changePassword";

const ChangePasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await changePassword(form.oldPassword, form.newPassword);

      if (result.success) {
        toast.success(result.message);
        // Backend invalidates refresh token on password change — force re-login
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(["oldPassword", "newPassword", "confirmPassword"] as const).map(
        (key) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">
              {key === "oldPassword"
                ? "Current password"
                : key === "newPassword"
                  ? "New password"
                  : "Confirm new password"}
            </span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                minLength={key === "oldPassword" ? 1 : 8}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
              {key === "newPassword" && (
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </label>
        ),
      )}

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
        For security, all other sessions will be logged out after changing your
        password.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
