"use client";

import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import PasswordRequirements from "@/components/shared/PasswordRequirements";
import { resetPassword } from "@/services/auth/resetPassword";

interface Props {
  userId: string;
  token: string;
}

const ResetPasswordForm = ({ userId, token }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword({
        id: userId,
        token,
        newPassword: password,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Password reset successful!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your password has been updated. Redirecting to login...
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* New password */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-slate-700">
          New password
        </span>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            minLength={8}
            autoComplete="new-password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <PasswordRequirements password={password} />
      </label>

      {/* Confirm password */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-slate-700">
          Confirm password
        </span>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type={show ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            minLength={8}
            autoComplete="new-password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </label>

      {/* Mismatch warning */}
      {confirmPassword && password !== confirmPassword && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
          Passwords do not match
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Reset password
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs font-bold text-slate-600 hover:text-sky-700"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
