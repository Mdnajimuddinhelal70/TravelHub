"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect");

  const [isRedirecting, setIsRedirecting] = useState(!error);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  useEffect(() => {
    if (error) return;
    const timer = setTimeout(() => {
      setHasTimedOut(true);
      const destination =
        redirect && redirect !== "/" && redirect.startsWith("/")
          ? redirect
          : "/dashboard";
      router.push(destination);
    }, 1500);
    return () => clearTimeout(timer);
  }, [error, redirect, router]);

  // ✅ Render-time derived state
  const status = useMemo<"loading" | "success" | "error">(() => {
    if (error) return "error";
    if (hasTimedOut) return "success";
    return "loading";
  }, [error, hasTimedOut]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-sky-500" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Completing Google Sign-in...
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Sign-in Successful!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-rose-500" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Sign-in Failed
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {error || "Something went wrong. Please try again."}
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-bold text-white shadow-md"
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
