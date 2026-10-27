"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { createBooking } from "@/services/booking/createBooking";
import type { ITour, ITourDeparture, ITraveler } from "@/types";

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

const emptyTraveler = (): ITraveler => ({
  name: "",
  age: 18,
  gender: "male",
  type: "adult",
  nidOrPassport: "",
});

interface Props {
  tour: ITour;
  departure: ITourDeparture;
}

const BookingForm = ({ tour, departure }: Props) => {
  const [state, formAction, isPending] = useActionState(createBooking, null);

  const [travelers, setTravelers] = useState<ITraveler[]>([emptyTraveler()]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
    emergencyContact: "",
  });
  const [specialRequests, setSpecialRequests] = useState("");

  // Redirect to SSLCommerz when booking succeeds
  useEffect(() => {
    if (!state) return;

    const paymentUrl =
      "paymentUrl" in state
        ? (state as { paymentUrl?: string }).paymentUrl
        : undefined;

    if (state.success && paymentUrl) {
      toast.success("Booking created! Redirecting to payment...");
      window.location.href = paymentUrl;
    } else if (!state.success) {
      toast.error(state.message || "Booking failed. Please try again.");
    }
  }, [state]);

  const adultCount = travelers.filter((t) => t.type === "adult").length;
  const childCount = travelers.filter((t) => t.type === "child").length;
  const guestCount = travelers.length;

  const totalPrice = useMemo(() => {
    const adultPrice = departure.pricePerPerson;
    const childPrice = tour.price?.child ?? adultPrice;
    return adultPrice * adultCount + childPrice * childCount;
  }, [departure.pricePerPerson, tour.price, adultCount, childCount]);

  const canAddMore = guestCount < departure.availableSeats;

  const addTraveler = () => {
    if (!canAddMore) return;
    setTravelers((prev) => [...prev, emptyTraveler()]);
  };

  const removeTraveler = (index: number) => {
    if (travelers.length <= 1) return;
    if (adultCount === 1 && travelers[index].type === "adult") {
      toast.error("At least one adult traveler is required.");
      return;
    }
    setTravelers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTraveler = (
    index: number,
    field: keyof ITraveler,
    value: string | number,
  ) => {
    setTravelers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="tourDeparture" value={departure._id} />
      <input type="hidden" name="travelers" value={JSON.stringify(travelers)} />
      <input
        type="hidden"
        name="contactInfo"
        value={JSON.stringify(contactInfo)}
      />
      <input type="hidden" name="specialRequests" value={specialRequests} />

      {/* Tour summary */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
            <Image
              src={
                tour.coverImage ||
                tour.images?.[0] ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              }
              alt={tour.title}
              fill
              sizes="(max-width: 640px) 100vw, 128px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-slate-900">{tour.title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {typeof tour.primaryDestination === "object" &&
                tour.primaryDestination !== null
                  ? tour.primaryDestination.name
                  : typeof tour.destinations[0] === "object" &&
                      tour.destinations[0] !== null
                    ? tour.destinations[0].name
                    : "Multiple destinations"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {tour.duration.days}D / {tour.duration.nights}N
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(departure.startDate)} —{" "}
                {formatDate(departure.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-sky-50 p-3 text-xs">
          <span className="font-semibold text-sky-800">
            {departure.availableSeats} seat
            {departure.availableSeats !== 1 ? "s" : ""} left
          </span>
          <span className="text-sky-700">•</span>
          <span className="font-semibold text-sky-800">
            {formatPrice(departure.pricePerPerson)} / adult
          </span>
          {tour.price?.child !== undefined && (
            <>
              <span className="text-sky-700">•</span>
              <span className="font-semibold text-sky-800">
                {formatPrice(tour.price.child)} / child
              </span>
            </>
          )}
        </div>
      </section>

      {/* Travelers */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
            <UsersRound className="h-4 w-4 text-sky-600" />
            Travelers ({guestCount})
          </h2>
          <button
            type="button"
            onClick={addTraveler}
            disabled={!canAddMore}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 text-xs font-bold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add traveler
          </button>
        </div>

        <div className="space-y-3">
          {travelers.map((t, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  Traveler #{index + 1}
                </p>
                {travelers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTraveler(index)}
                    className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) =>
                    updateTraveler(index, "name", e.target.value)
                  }
                  placeholder="Full name"
                  required
                  minLength={2}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <input
                  type="number"
                  value={t.age}
                  onChange={(e) =>
                    updateTraveler(index, "age", Number(e.target.value))
                  }
                  placeholder="Age"
                  required
                  min={0}
                  max={120}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={t.gender}
                  onChange={(e) =>
                    updateTraveler(index, "gender", e.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={t.type}
                  onChange={(e) =>
                    updateTraveler(index, "type", e.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="adult">Adult</option>
                  <option value="child">Child</option>
                </select>
                <input
                  type="text"
                  value={t.nidOrPassport ?? ""}
                  onChange={(e) =>
                    updateTraveler(index, "nidOrPassport", e.target.value)
                  }
                  placeholder="NID / Passport (optional)"
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact info */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-900">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={contactInfo.name}
            onChange={(e) =>
              setContactInfo((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Full name"
            required
            minLength={2}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) =>
              setContactInfo((p) => ({ ...p, phone: e.target.value }))
            }
            placeholder="Phone (01XXXXXXXXX)"
            required
            pattern="(?:\+8801\d{9}|01\d{9})"
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) =>
              setContactInfo((p) => ({ ...p, email: e.target.value }))
            }
            placeholder="Email"
            required
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:col-span-2"
          />
          <input
            type="tel"
            value={contactInfo.emergencyContact}
            onChange={(e) =>
              setContactInfo((p) => ({
                ...p,
                emergencyContact: e.target.value,
              }))
            }
            placeholder="Emergency contact (optional)"
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:col-span-2"
          />
        </div>

        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Special requests (optional)"
          maxLength={1000}
          rows={3}
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </section>

      {/* Price summary + submit */}
      <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-sky-50/70 p-5 shadow-sm">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-700">
            <span>
              Adults × {adultCount} — {formatPrice(departure.pricePerPerson)}
            </span>
            <span>{formatPrice(departure.pricePerPerson * adultCount)}</span>
          </div>
          {childCount > 0 && (
            <div className="flex items-center justify-between text-slate-700">
              <span>
                Children × {childCount} —{" "}
                {formatPrice(tour.price?.child ?? departure.pricePerPerson)}
              </span>
              <span>
                {formatPrice(
                  (tour.price?.child ?? departure.pricePerPerson) * childCount,
                )}
              </span>
            </div>
          )}
          <hr className="border-slate-200" />
          <div className="flex items-center justify-between text-base font-bold text-slate-950">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Final price is confirmed on the server. Taxes or coupons (if any)
            will be applied at checkout.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || departure.availableSeats < guestCount}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            "Creating booking..."
          ) : (
            <>
              <Check className="h-4 w-4" />
              Confirm booking & pay
            </>
          )}
        </button>

        {departure.availableSeats < guestCount && (
          <p className="mt-2 text-center text-xs font-semibold text-rose-600">
            Not enough seats left for {guestCount} travelers.
          </p>
        )}
      </section>
    </form>
  );
};

export default BookingForm;
