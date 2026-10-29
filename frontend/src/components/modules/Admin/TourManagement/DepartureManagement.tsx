"use client";

import {
  Calendar,
  CalendarPlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  createDeparture,
  CreateDeparturePayload,
} from "@/services/tour-departure/createDeparture";
import { deleteDeparture } from "@/services/tour-departure/deleteDeparture";
import { updateDeparture } from "@/services/tour-departure/updateDeparture";
import type { ITour, ITourDeparture } from "@/types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const toInputDate = (date: string) =>
  new Date(date).toISOString().split("T")[0];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "FULL":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "SCHEDULED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "COMPLETED":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

interface Props {
  tour: ITour;
  initialDepartures: ITourDeparture[];
}

interface FormState {
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  totalSeats: number;
  minGroupSize: number;
  status: string;
  meetingPoint: string;
  notes: string;
}

const emptyForm = (tour: ITour): FormState => ({
  startDate: "",
  endDate: "",
  pricePerPerson: tour.price.adult,
  totalSeats: 20,
  minGroupSize: 2,
  status: "OPEN",
  meetingPoint: "",
  notes: "",
});

const DepartureManagement = ({ tour, initialDepartures }: Props) => {
  const [departures, setDepartures] =
    useState<ITourDeparture[]>(initialDepartures);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(tour));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm(tour));
    setShowForm(true);
  };

  const openEdit = (dep: ITourDeparture) => {
    setEditingId(dep._id);
    setForm({
      startDate: toInputDate(dep.startDate),
      endDate: toInputDate(dep.endDate),
      pricePerPerson: dep.pricePerPerson,
      totalSeats: dep.totalSeats,
      minGroupSize: dep.minGroupSize ?? 2,
      status: dep.status,
      meetingPoint: dep.meetingPoint ?? "",
      notes: dep.notes ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm(tour));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      return toast.error("Start and end dates are required");
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return toast.error("End date must be after start date");
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const result = await updateDeparture(editingId, {
          startDate: form.startDate,
          endDate: form.endDate,
          pricePerPerson: form.pricePerPerson,
          totalSeats: form.totalSeats,
          minGroupSize: form.minGroupSize,
          status: form.status,
          meetingPoint: form.meetingPoint || undefined,
          notes: form.notes || undefined,
        });

        if (result.success) {
          toast.success(result.message);
          // Refresh local state
          setDepartures((prev) =>
            prev.map((d) =>
              d._id === editingId
                ? {
                    ...d,
                    startDate: new Date(form.startDate).toISOString(),
                    endDate: new Date(form.endDate).toISOString(),
                    pricePerPerson: form.pricePerPerson,
                    totalSeats: form.totalSeats,
                    minGroupSize: form.minGroupSize,
                    status: form.status as ITourDeparture["status"],
                    meetingPoint: form.meetingPoint,
                    notes: form.notes,
                  }
                : d,
            ),
          );
          closeForm();
        } else {
          toast.error(result.message);
        }
      } else {
        const payload: CreateDeparturePayload = {
          tour: tour._id,
          startDate: form.startDate,
          endDate: form.endDate,
          pricePerPerson: form.pricePerPerson,
          totalSeats: form.totalSeats,
          minGroupSize: form.minGroupSize,
          status: form.status,
          meetingPoint: form.meetingPoint || undefined,
          notes: form.notes || undefined,
        };

        const result = await createDeparture(payload);
        if (result.success && result.departure) {
          toast.success(result.message);
          setDepartures((prev) =>
            [...prev, result.departure!].sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            ),
          );
          closeForm();
        } else {
          toast.error(result.message);
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (dep: ITourDeparture) => {
    if (
      !window.confirm(
        `Delete departure on ${formatDate(dep.startDate)}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(dep._id);
    const result = await deleteDeparture(dep._id);
    if (result.success) {
      toast.success(result.message);
      setDepartures((prev) => prev.filter((d) => d._id !== dep._id));
    } else {
      toast.error(result.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <CalendarPlus className="h-4 w-4" />
          Add departure
        </button>
      </div>

      {/* Form modal (inline) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border-2 border-sky-200 bg-sky-50/50 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {editingId ? "Edit departure" : "New departure"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Start date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
                className={inputCls}
              />
            </Field>
            <Field label="End date" required>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Price per person (৳)" required>
              <input
                type="number"
                min={0}
                value={form.pricePerPerson}
                onChange={(e) =>
                  setForm({ ...form, pricePerPerson: Number(e.target.value) })
                }
                required
                className={inputCls}
              />
            </Field>
            <Field label="Total seats" required>
              <input
                type="number"
                min={1}
                value={form.totalSeats}
                onChange={(e) =>
                  setForm({ ...form, totalSeats: Number(e.target.value) })
                }
                required
                className={inputCls}
              />
            </Field>
            <Field label="Min group size">
              <input
                type="number"
                min={1}
                value={form.minGroupSize}
                onChange={(e) =>
                  setForm({ ...form, minGroupSize: Number(e.target.value) })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="OPEN">Open</option>
                <option value="FULL">Full</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </Field>
            <Field label="Meeting point" className="sm:col-span-2">
              <input
                type="text"
                value={form.meetingPoint}
                onChange={(e) =>
                  setForm({ ...form, meetingPoint: e.target.value })
                }
                placeholder="e.g. Gabtoli Bus Terminal, Dhaka"
                className={inputCls}
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Additional instructions for travelers"
                className={`${inputCls} py-2`}
              />
            </Field>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {editingId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  {editingId ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Departure list */}
      {departures.length > 0 ? (
        <div className="space-y-3">
          {departures.map((dep) => {
            const isDeleting = deletingId === dep._id;
            return (
              <div
                key={dep._id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                          dep.status,
                        )}`}
                      >
                        {dep.status}
                      </span>
                      {dep.availableSeats === 0 && (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Calendar className="h-4 w-4 text-sky-600" />
                      {formatDate(dep.startDate)} → {formatDate(dep.endDate)}
                    </p>
                    {dep.meetingPoint && (
                      <p className="mt-1 text-xs text-slate-500">
                        Meeting point: {dep.meetingPoint}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Price / person
                      </p>
                      <p className="text-base font-extrabold text-slate-900">
                        {formatPrice(dep.pricePerPerson)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Seats
                      </p>
                      <p className="inline-flex items-center gap-1 text-base font-extrabold text-slate-900">
                        <Users className="h-4 w-4 text-sky-600" />
                        {dep.availableSeats} / {dep.totalSeats}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(dep)}
                    disabled={isDeleting}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:opacity-60"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(dep)}
                    disabled={isDeleting}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            No departures yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Add at least one departure so travelers can book this tour.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            Add first departure
          </button>
        </div>
      )}
    </div>
  );
};

const inputCls =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

const Field = ({
  label,
  children,
  className,
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) => (
  <label className={`block ${className ?? ""}`}>
    <span className="mb-1.5 block text-xs font-bold text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
    {children}
  </label>
);

export default DepartureManagement;
