"use client";

import { loginUser } from "@/services/auth/loginUser";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import InputFieldError from "./shared/InputFieldError";
import GoogleLoginButton from "./SocialLoginBtn/GoogleLoginButton";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div>
      {/* Google Login */}
      <GoogleLoginButton />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-5">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <FieldGroup>
          <div className="grid grid-cols-1 gap-4">
            {/* Email */}
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-xs font-bold text-slate-700"
              >
                Email address
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-11 rounded-lg border-slate-200 bg-slate-50/70 px-3 text-sm transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
              <InputFieldError field="email" state={state} />
            </Field>

            {/* Password */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-bold text-slate-700"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-sky-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-11 rounded-lg border-slate-200 bg-slate-50/70 px-3 pr-10 text-sm transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <InputFieldError field="password" state={state} />
            </Field>
          </div>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>

        <FieldDescription className="pt-2 text-center text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-sky-700 hover:underline"
          >
            Sign up free
          </Link>
        </FieldDescription>
      </form>
    </div>
  );
};

export default LoginForm;
