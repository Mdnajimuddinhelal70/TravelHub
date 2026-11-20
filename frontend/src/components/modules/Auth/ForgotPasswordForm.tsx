"use client";

import { forgotPassword } from "@/services/auth/forgotPassword";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    startTransition(async () => {
      const result = await forgotPassword(email.trim().toLowerCase());
      if (result.success) {
        setIsSuccess(true);
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error(result.message);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Mail className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Check your email</h2>
          <p className="mt-2 text-sm text-slate-600">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-bold text-slate-800">{email}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <Send className="h-4 w-4" />
            Send again
          </button>

          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-center text-sm text-slate-600">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-slate-700">
          Email address
        </span>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send reset link
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-sky-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
