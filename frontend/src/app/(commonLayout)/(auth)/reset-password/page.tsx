import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { Lock } from "lucide-react";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) => {
  const params = await searchParams;

  if (!params.id || !params.token) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50 px-4 pt-24">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Invalid reset link
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            The reset link is missing or has expired. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-6 text-sm font-bold text-white shadow-md"
          >
            Request new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-emerald-200/40 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-sky-200/30 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:25px_25px] opacity-[0.08]"
      />

      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
            <div
              aria-hidden="true"
              className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500"
            />

            <div className="px-6 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10">
              <div className="mb-6 space-y-2 text-center">
                <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/25">
                  <Lock className="h-7 w-7" />
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Set new password
                </h1>
                <p className="text-sm text-slate-600">
                  Choose a strong password to secure your account
                </p>
              </div>

              <ResetPasswordForm userId={params.id} token={params.token} />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Remember your password?{" "}
            <a href="/login" className="font-bold text-sky-700 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
