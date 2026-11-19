"use client";

import { Check, Circle } from "lucide-react";

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    label: "One uppercase letter (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    label: "One lowercase letter (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  {
    label: "One number (0-9)",
    test: (p) => /\d/.test(p),
  },
  {
    label: "One special character (!@#$%^&*)",
    test: (p) => /[!@#$%^&*]/.test(p),
  },
];

interface Props {
  password: string;
}

const PasswordRequirements = ({ password }: Props) => {
  const fulfilled = requirements.filter((r) => r.test(password));
  const allFulfilled = fulfilled.length === requirements.length;

  const strength = fulfilled.length;
  const strengthLevel =
    strength === 0
      ? { label: "", color: "bg-slate-200", textColor: "text-slate-400" }
      : strength <= 2
        ? { label: "Weak", color: "bg-rose-500", textColor: "text-rose-600" }
        : strength <= 3
          ? {
              label: "Fair",
              color: "bg-amber-500",
              textColor: "text-amber-600",
            }
          : strength <= 4
            ? { label: "Good", color: "bg-sky-500", textColor: "text-sky-600" }
            : {
                label: "Strong",
                color: "bg-emerald-500",
                textColor: "text-emerald-600",
              };

  // Don't show if password is empty
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Requirements list */}
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {requirements.map((req) => {
          const passed = req.test(password);
          return (
            <li
              key={req.label}
              className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                passed ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {passed ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strengthLevel.color}`}
            style={{ width: `${(strength / requirements.length) * 100}%` }}
          />
        </div>

        {strengthLevel.label && (
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${strengthLevel.textColor}`}
          >
            Strength: {strengthLevel.label}
          </p>
        )}
      </div>

      {/* Success message */}
      {allFulfilled && (
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
          <Check className="h-3.5 w-3.5" />
          Password is strong and ready!
        </p>
      )}
    </div>
  );
};

export default PasswordRequirements;
