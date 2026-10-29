"use client";

import { ChevronLeft, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateTour } from "@/services/tour/updateTour";
import type {
  IDestination,
  IDivision,
  ITour,
  ITourPlan,
  ITourType,
} from "@/types";

interface Props {
  tour: ITour;
  tourTypes: ITourType[];
  divisions: IDivision[];
  destinations: IDestination[];
}

const TourEditForm = ({ tour, tourTypes, divisions, destinations }: Props) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Basics
  const [title, setTitle] = useState(tour.title ?? "");
  const [description, setDescription] = useState(tour.description ?? "");
  const [tourType, setTourType] = useState(
    typeof tour.tourType === "object" ? tour.tourType._id : tour.tourType,
  );
  const [category, setCategory] = useState(tour.category ?? "");
  const [difficulty, setDifficulty] = useState(tour.difficulty ?? "");
  const [status, setStatus] = useState(tour.status ?? "draft");
  const [selectedDivision, setSelectedDivision] = useState(
    tour.primaryDestination &&
      typeof tour.primaryDestination === "object" &&
      typeof tour.primaryDestination.division === "object" &&
      tour.primaryDestination.division !== null
      ? tour.primaryDestination.division._id
      : "",
  );
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    Array.isArray(tour.destinations)
      ? tour.destinations.map((d) => (typeof d === "object" ? d._id : d))
      : [],
  );
  const [primaryDestination, setPrimaryDestination] = useState(
    tour.primaryDestination && typeof tour.primaryDestination === "object"
      ? tour.primaryDestination._id
      : typeof tour.primaryDestination === "string"
        ? tour.primaryDestination
        : "",
  );

  // Duration & price
  const [days, setDays] = useState(tour.duration?.days ?? 3);
  const [nights, setNights] = useState(tour.duration?.nights ?? 2);
  const [adultPrice, setAdultPrice] = useState(tour.price?.adult ?? 0);
  const [childPrice, setChildPrice] = useState(tour.price?.child ?? 0);
  const [discountPercent, setDiscountPercent] = useState(
    tour.price?.discountPercent ?? 0,
  );
  const [minGroupSize, setMinGroupSize] = useState(tour.minGroupSize ?? 2);
  const [maxGuest, setMaxGuest] = useState(tour.maxGuest ?? 20);
  const [minAge, setMinAge] = useState(tour.minAge ?? 0);
  const [cancellationPolicy, setCancellationPolicy] = useState(
    tour.cancellationPolicy ?? "",
  );

  // Images
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  // Tags
  const [included, setIncluded] = useState<string[]>(tour.included ?? []);
  const [excluded, setExcluded] = useState<string[]>(tour.excluded ?? []);
  const [amenities, setAmenities] = useState<string[]>(tour.amenities ?? []);

  // Itinerary
  const [tourPlan, setTourPlan] = useState<ITourPlan[]>(
    tour.tourPlan?.length
      ? tour.tourPlan
      : [{ day: 1, title: "", description: "", meals: [], accommodation: "" }],
  );

  const existingImages = (tour.images ?? []).filter(
    (img) => !deleteImages.includes(img),
  );

  const availableDestinations = selectedDivision
    ? destinations.filter((d) => {
        const divId =
          typeof d.division === "object" && d.division !== null
            ? d.division._id
            : d.division;
        return divId === selectedDivision;
      })
    : destinations;

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (existingImages.length + newImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteImage = (url: string) => {
    setDeleteImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  const toggleDestination = (destId: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(destId)
        ? prev.filter((id) => id !== destId)
        : [...prev, destId],
    );
  };

  const addPlanDay = () => {
    setTourPlan((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        title: "",
        description: "",
        meals: [],
        accommodation: "",
      },
    ]);
  };

  const removePlanDay = (index: number) => {
    if (tourPlan.length <= 1) return;
    setTourPlan((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 })),
    );
  };

  const updatePlanDay = (index: number, patch: Partial<ITourPlan>) => {
    setTourPlan((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!tourType) return toast.error("Tour type is required");
    if (selectedDestinations.length === 0)
      return toast.error("At least one destination is required");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("tourType", tourType);
    if (category) formData.append("category", category);
    if (difficulty) formData.append("difficulty", difficulty);
    if (primaryDestination)
      formData.append("primaryDestination", primaryDestination);
    formData.append("status", status);
    if (cancellationPolicy)
      formData.append("cancellationPolicy", cancellationPolicy);

    formData.append("destinations", JSON.stringify(selectedDestinations));
    formData.append("duration", JSON.stringify({ days, nights }));
    formData.append(
      "price",
      JSON.stringify({ adult: adultPrice, child: childPrice, discountPercent }),
    );
    formData.append("included", JSON.stringify(included));
    formData.append("excluded", JSON.stringify(excluded));
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("tourPlan", JSON.stringify(tourPlan));
    formData.append("minGroupSize", String(minGroupSize));
    formData.append("maxGuest", String(maxGuest));
    formData.append("minAge", String(minAge));

    if (deleteImages.length > 0) {
      formData.append("deleteImages", JSON.stringify(deleteImages));
    }

    newImages.forEach((file) => formData.append("files", file));

    setIsPending(true);
    try {
      const result = await updateTour(tour._id, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/dashboard/tour-management");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update tour");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/dashboard/tour-management"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to tours
      </Link>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tour Title" className="sm:col-span-2" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={150}
              className={inputCls}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`${inputCls} py-2`}
            />
          </Field>
          <Field label="Tour Type" required>
            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              required
              className={inputCls}
            >
              <option value="">Select tour type</option>
              {tourTypes.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className={inputCls}
            >
              <option value="">None</option>
              <option value="group">Group</option>
              <option value="family">Family</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="adventure">Adventure</option>
              <option value="corporate">Corporate</option>
            </select>
          </Field>
          <Field label="Difficulty">
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as typeof difficulty)
              }
              className={inputCls}
            >
              <option value="">None</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Destinations — same as create */}
      <Section title="Destinations">
        <Field label="Filter by division">
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDestinations([]);
              setPrimaryDestination("");
            }}
            className={inputCls}
          >
            <option value="">All divisions</option>
            {divisions.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {availableDestinations.map((d) => {
            const checked = selectedDestinations.includes(d._id);
            return (
              <label
                key={d._id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  checked
                    ? "border-sky-400 bg-sky-50 text-sky-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-sky-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDestination(d._id)}
                  className="h-4 w-4 accent-sky-600"
                />
                {d.name}
              </label>
            );
          })}
        </div>
        {selectedDestinations.length > 0 && (
          <Field label="Primary destination" className="mt-4">
            <select
              value={primaryDestination}
              onChange={(e) => setPrimaryDestination(e.target.value)}
              className={inputCls}
            >
              <option value="">None</option>
              {selectedDestinations.map((id) => {
                const d = destinations.find((x) => x._id === id);
                return (
                  <option key={id} value={id}>
                    {d?.name ?? id}
                  </option>
                );
              })}
            </select>
          </Field>
        )}
      </Section>

      {/* Duration & Pricing — same as create */}
      <Section title="Duration & Pricing">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Days">
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Nights">
            <input
              type="number"
              min={0}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Adult price (৳)">
            <input
              type="number"
              min={0}
              value={adultPrice}
              onChange={(e) => setAdultPrice(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Child price (৳)">
            <input
              type="number"
              min={0}
              value={childPrice}
              onChange={(e) => setChildPrice(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Discount %">
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Min group">
            <input
              type="number"
              min={1}
              value={minGroupSize}
              onChange={(e) => setMinGroupSize(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Max guests">
            <input
              type="number"
              min={1}
              value={maxGuest}
              onChange={(e) => setMaxGuest(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Min age">
            <input
              type="number"
              min={0}
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Cancellation policy" className="mt-4">
          <textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            rows={3}
            className={`${inputCls} py-2`}
          />
        </Field>
      </Section>

      {/* Images */}
      <Section title="Images (max 10)">
        <div className="flex flex-wrap gap-3">
          {/* Existing images */}
          {existingImages.map((url, i) => (
            <div
              key={`existing-${i}`}
              className="relative h-24 w-32 overflow-hidden rounded-lg border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`existing-${i}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => toggleDeleteImage(url)}
                className="absolute right-1 top-1 rounded-full bg-rose-500 p-1 text-white shadow"
                title="Mark for deletion"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {/* New images */}
          {newImages.map((file, i) => (
            <div
              key={`new-${i}`}
              className="relative h-24 w-32 overflow-hidden rounded-lg border border-sky-200 ring-2 ring-sky-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={`new-${i}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute right-1 top-1 rounded-full bg-rose-500 p-1 text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700">
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px] font-bold">Add image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImages}
              className="hidden"
            />
          </label>
        </div>
        {deleteImages.length > 0 && (
          <p className="mt-2 text-[11px] font-semibold text-rose-600">
            {deleteImages.length} image{deleteImages.length > 1 ? "s" : ""} will
            be deleted on save
          </p>
        )}
      </Section>

      {/* Tags */}
      <Section title="Inclusions & Amenities">
        <TagInput
          label="Included"
          tags={included}
          setTags={setIncluded}
          placeholder="e.g. Hotel, Breakfast"
        />
        <TagInput
          label="Excluded"
          tags={excluded}
          setTags={setExcluded}
          placeholder="e.g. Lunch, Insurance"
        />
        <TagInput
          label="Amenities"
          tags={amenities}
          setTags={setAmenities}
          placeholder="e.g. WiFi, AC Bus"
        />
      </Section>

      {/* Itinerary */}
      <Section title="Itinerary">
        <div className="space-y-3">
          {tourPlan.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  Day {item.day}
                </p>
                {tourPlan.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlanDay(index)}
                    className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updatePlanDay(index, { title: e.target.value })
                  }
                  placeholder="Day title"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={item.accommodation ?? ""}
                  onChange={(e) =>
                    updatePlanDay(index, { accommodation: e.target.value })
                  }
                  placeholder="Accommodation (optional)"
                  className={inputCls}
                />
                <textarea
                  value={item.description ?? ""}
                  onChange={(e) =>
                    updatePlanDay(index, { description: e.target.value })
                  }
                  placeholder="Description"
                  rows={2}
                  className={`${inputCls} py-2 sm:col-span-2`}
                />
                <input
                  type="text"
                  value={(item.meals ?? []).join(", ")}
                  onChange={(e) =>
                    updatePlanDay(index, {
                      meals: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Meals (comma-separated)"
                  className={`${inputCls} sm:col-span-2`}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPlanDay}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-4 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
          >
            <Plus className="h-3.5 w-3.5" /> Add day
          </button>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Link
          href="/admin/dashboard/tour-management"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:border-slate-300"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
};

const inputCls =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-base font-bold text-slate-900">{title}</h2>
    {children}
  </section>
);

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

const TagInput = ({
  label,
  tags,
  setTags,
  placeholder,
}: {
  label: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags([...tags, v]);
    setInput("");
  };

  return (
    <div className="mb-4">
      <p className="mb-1.5 text-xs font-bold text-slate-700">{label}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-11 shrink-0 items-center gap-1 rounded-lg bg-sky-100 px-3 text-xs font-bold text-sky-700 hover:bg-sky-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="text-slate-500 hover:text-rose-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourEditForm;
