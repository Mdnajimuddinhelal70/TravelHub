"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50 px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-100/50">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
          An unexpected error occurred while loading this page. Our team has
          been notified. You can try again or go back to home.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mx-auto mt-6 max-w-md rounded-xl border border-rose-200 bg-rose-50 p-4 text-left">
            <summary className="cursor-pointer text-xs font-bold text-rose-700">
              Error details (dev only)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words text-[11px] text-rose-900">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 text-xs text-slate-400">
            Error ID: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
