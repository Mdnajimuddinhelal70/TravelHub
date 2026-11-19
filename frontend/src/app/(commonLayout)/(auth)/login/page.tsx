import LoginForm from "@/components/login-form";

const LoginPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = (await searchParams) || {};

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-sky-200/40 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet-200/30 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:25px_25px] opacity-[0.08]"
      />

      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
            {/* Gradient top accent */}
            <div
              aria-hidden="true"
              className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500"
            />

            <div className="px-6 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10">
              {/* Header */}
              <div className="mb-6 space-y-2 text-center">
                <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-600">
                  Sign in to continue your journey with Travel Hub
                </p>
              </div>

              {/* Form */}
              <LoginForm redirect={params.redirect} />
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="#" className="font-semibold text-sky-700 hover:underline">
              Terms
            </a>{" "}
            &amp;{" "}
            <a href="#" className="font-semibold text-sky-700 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
