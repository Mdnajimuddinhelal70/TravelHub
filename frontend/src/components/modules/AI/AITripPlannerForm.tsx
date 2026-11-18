"use client";

import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { generateTripPlan } from "@/services/ai/generateTripPlan";
import type { IAiTripPlan } from "@/types/ai.interface";

interface Props {
  onSuccess: (plan: IAiTripPlan) => void;
}

const AITripPlannerForm = ({ onSuccess }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budget: 15000,
    adults: 2,
    children: 0,
    interests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    if (form.days < 1 || form.days > 30) {
      toast.error("Days must be between 1 and 30");
      return;
    }
    if (form.budget < 1000) {
      toast.error("Budget must be at least ৳1,000");
      return;
    }

    startTransition(async () => {
      const result = await generateTripPlan({
        destination: form.destination.trim(),
        days: form.days,
        budget: form.budget,
        adults: form.adults,
        children: form.children,
        interests: form.interests.trim() || undefined,
      });

      if (result.success && result.plan) {
        toast.success("Trip plan generated! 🎉");
        onSuccess(result.plan);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-lg shadow-violet-500/25">
          <Wand2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Tell us about your trip
          </h2>
          <p className="text-xs text-slate-500">
            Our AI will create a personalized itinerary
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Destination */}
        <Field label="Where do you want to go?" required>
          <input
            type="text"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            placeholder="e.g. Cox's Bazar, Sundarban, Sylhet..."
            required
            className={inputCls}
          />
        </Field>

        {/* Days + Budget */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="How many days?" required>
            <input
              type="number"
              min={1}
              max={30}
              value={form.days}
              onChange={(e) =>
                setForm({ ...form, days: Number(e.target.value) })
              }
              required
              className={inputCls}
            />
          </Field>

          <Field label="Total budget (৳)" required>
            <input
              type="number"
              min={1000}
              step={1000}
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: Number(e.target.value) })
              }
              required
              className={inputCls}
            />
          </Field>
        </div>

        {/* Adults + Children */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Adults" required>
            <input
              type="number"
              min={1}
              max={20}
              value={form.adults}
              onChange={(e) =>
                setForm({ ...form, adults: Number(e.target.value) })
              }
              required
              className={inputCls}
            />
          </Field>

          <Field label="Children">
            <input
              type="number"
              min={0}
              max={10}
              value={form.children}
              onChange={(e) =>
                setForm({ ...form, children: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
        </div>

        {/* Interests */}
        <Field label="Your interests (optional)">
          <input
            type="text"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="e.g. Beach, seafood, nature, adventure..."
            className={inputCls}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating your plan (10-15s)...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate My Trip Plan
          </>
        )}
      </button>
    </form>
  );
};

const inputCls =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const Field = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
    {children}
  </label>
);

export default AITripPlannerForm;
