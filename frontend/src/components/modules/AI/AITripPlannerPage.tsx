"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { IAiTripPlan } from "@/types/ai.interface";
import AITripPlannerForm from "./AITripPlannerForm";
import TripPlanResult from "./TripPlanResult";

const AITripPlannerPage = () => {
  const [plan, setPlan] = useState<IAiTripPlan | null>(null);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-violet-50/40 via-white to-fuchsia-50/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-violet-200/40 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-fuchsia-200/30 blur-[120px]"
      />

      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-violet-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* Header */}
        {!plan && (
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white px-4 py-2 shadow-sm shadow-violet-100/70">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                AI Trip Planner
              </span>
            </div>

            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Let AI Plan Your
              <span className="mt-1 block bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                Perfect Journey
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Tell us where you want to go, your budget, and preferences — our
              AI will create a personalized day-by-day itinerary just for you.
            </p>
          </div>
        )}

        {/* Content — form or result */}
        <AnimatePresence mode="wait">
          {plan ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TripPlanResult plan={plan} onReset={() => setPlan(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AITripPlannerForm onSuccess={setPlan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AITripPlannerPage;
