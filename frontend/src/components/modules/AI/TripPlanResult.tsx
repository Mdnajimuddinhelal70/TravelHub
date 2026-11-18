"use client";

import {
  Calendar,
  Check,
  Coffee,
  Hotel,
  Lightbulb,
  MapPin,
  RotateCcw,
  Sparkles,
  Wallet,
} from "lucide-react";

import type { IAiTripPlan } from "@/types/ai.interface";

interface Props {
  plan: IAiTripPlan;
  onReset: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const TripPlanResult = ({ plan, onReset }: Props) => {
  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-6 text-white shadow-2xl shadow-violet-500/20 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Your AI-Generated Plan
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {plan.destination}
          </h2>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/80" />
              <span className="font-bold">{plan.duration} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-white/80" />
              <span className="font-bold">
                {formatPrice(plan.estimatedCost)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Plan another trip
          </button>
        </div>
      </div>

      {/* Day-by-day plan */}
      <div className="space-y-4">
        {plan.days.map((day) => (
          <div
            key={day.day}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            {/* Day header */}
            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-lg font-extrabold text-white shadow-md">
                {day.day}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Day {day.day}
                </p>
                <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  {day.title}
                </h3>
              </div>
            </div>

            {/* Day content */}
            <div className="p-4 sm:p-5">
              {/* Activities */}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  Activities
                </p>
                <ul className="space-y-2">
                  {day.activities.map((activity, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meals */}
              {day.meals && day.meals.length > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50/50 p-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    <Coffee className="h-3.5 w-3.5" />
                    Meals
                  </p>
                  <ul className="space-y-1">
                    {day.meals.map((meal, i) => (
                      <li key={i} className="text-xs text-amber-900">
                        • {meal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Accommodation */}
              {day.accommodation && (
                <div className="mt-3 rounded-xl bg-sky-50/50 p-3">
                  <p className="flex items-start gap-1.5 text-xs text-sky-900">
                    <Hotel className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <span className="font-bold">Stay: </span>
                      {day.accommodation}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Travel Tips</h3>
          </div>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-emerald-900"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TripPlanResult;
