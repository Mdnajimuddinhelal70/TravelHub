import { Home, Search } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Visual */}
        <div className="relative mx-auto mb-8 flex h-40 w-full items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 mx-auto h-32 w-32 rounded-full bg-sky-100/60 blur-3xl"
          />
          <span className="relative text-[140px] font-black leading-none tracking-tighter text-transparent bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 bg-clip-text sm:text-[180px]">
            404
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist, has been moved,
          or is temporarily unavailable. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>

          <Link
            href="/tours"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
          >
            <Search className="h-4 w-4" />
            Browse tours
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
