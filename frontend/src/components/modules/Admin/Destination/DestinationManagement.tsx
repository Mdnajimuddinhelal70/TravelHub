"use client";

import {
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createDestination,
  CreateDestinationInput,
} from "@/services/destination/createDestination";
import { deleteDestination } from "@/services/destination/deleteDestination";
import { updateDestination } from "@/services/destination/updateDestination";
import type { IDestination, IDivision } from "@/types";

interface Props {
  initialDestinations: IDestination[];
  divisions: IDivision[];
}

interface FormState {
  name: string;
  division: string;
  description: string;
  isActive: boolean;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
}

const emptyForm: FormState = {
  name: "",
  division: "",
  description: "",
  isActive: true,
  thumbnailFile: null,
  thumbnailPreview: null,
};

const DestinationManagement = ({ initialDestinations, divisions }: Props) => {
  const [destinations, setDestinations] =
    useState<IDestination[]>(initialDestinations);
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return destinations.filter((d) => {
      const matchesSearch = !q || d.name.toLowerCase().includes(q);
      const divisionId =
        typeof d.division === "object" && d.division !== null
          ? d.division._id
          : d.division;
      const matchesDivision = !divisionFilter || divisionId === divisionFilter;
      return matchesSearch && matchesDivision;
    });
  }, [destinations, searchQuery, divisionFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, division: divisions[0]?._id ?? "" });
    setShowForm(true);
  };

  const openEdit = (dest: IDestination) => {
    setEditingId(dest._id);
    setForm({
      name: dest.name,
      division:
        typeof dest.division === "object" && dest.division !== null
          ? dest.division._id
          : dest.division,
      description: dest.description ?? "",
      isActive: dest.isActive,
      thumbnailFile: null,
      thumbnailPreview: dest.thumbnail ?? null,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be smaller than 5MB");
    }
    setForm({
      ...form,
      thumbnailFile: file,
      thumbnailPreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.division) return toast.error("Division is required");

    setIsSubmitting(true);

    try {
      if (editingId) {
        const result = await updateDestination(editingId, {
          name: form.name.trim(),
          division: form.division,
          description: form.description.trim(),
          isActive: form.isActive,
          thumbnailFile: form.thumbnailFile ?? undefined,
        });

        if (result.success) {
          toast.success(result.message);
          const divObj = divisions.find((d) => d._id === form.division);
          setDestinations((prev) =>
            prev.map((d) =>
              d._id === editingId
                ? {
                    ...d,
                    name: form.name.trim(),
                    division: divObj ?? form.division,
                    description: form.description.trim(),
                    isActive: form.isActive,
                    thumbnail: form.thumbnailPreview ?? d.thumbnail,
                  }
                : d,
            ),
          );
          closeForm();
        } else {
          toast.error(result.message);
        }
      } else {
        const input: CreateDestinationInput = {
          name: form.name.trim(),
          division: form.division,
          description: form.description.trim(),
          isActive: form.isActive,
          thumbnailFile: form.thumbnailFile ?? undefined,
        };

        const result = await createDestination(input);
        if (result.success && result.destinationId) {
          toast.success(result.message);
          const divObj = divisions.find((d) => d._id === form.division);
          const newDest: IDestination = {
            _id: result.destinationId,
            name: form.name.trim(),
            slug: form.name.toLowerCase().replace(/\s+/g, "-"),
            division: divObj ?? form.division,
            description: form.description.trim(),
            isActive: form.isActive,
            thumbnail: form.thumbnailPreview ?? undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setDestinations((prev) => [newDest, ...prev]);
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

  const handleDelete = async (dest: IDestination) => {
    if (
      !window.confirm(
        `Delete "${dest.name}"? This will fail if tours use this destination.`,
      )
    ) {
      return;
    }

    setDeletingId(dest._id);
    const result = await deleteDestination(dest._id);
    if (result.success) {
      toast.success(result.message);
      setDestinations((prev) => prev.filter((d) => d._id !== dest._id));
    } else {
      toast.error(result.message);
    }
    setDeletingId(null);
  };

  const getDivisionName = (div: IDestination["division"]): string => {
    if (typeof div === "object" && div !== null) return div.name;
    return divisions.find((d) => d._id === div)?.name ?? "—";
  };

  return (
    <div className="space-y-6">
      {/* Filters + create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:max-w-[200px]"
          >
            <option value="">All divisions</option>
            {divisions.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={divisions.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add destination
        </button>
      </div>

      {divisions.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Create a division first before adding destinations.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border-2 border-sky-200 bg-sky-50/50 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {editingId ? "Edit destination" : "New destination"}
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
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">
                Name <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">
                Division <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
                required
                className={inputCls}
              >
                <option value="">Select division</option>
                {divisions.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className={`${inputCls} py-2`}
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-4 w-4 accent-sky-600"
              />
              <span className="text-sm font-semibold text-slate-700">
                Active
              </span>
            </label>

            <div className="flex items-center gap-3">
              {form.thumbnailPreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.thumbnailPreview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <label className="flex h-16 cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 text-xs font-bold text-slate-600 hover:border-sky-400 hover:text-sky-700">
                <ImagePlus className="h-4 w-4" />
                Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
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
                  Saving...
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => {
            const isDeleting = deletingId === dest._id;
            return (
              <div
                key={dest._id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >
                {dest.thumbnail ? (
                  <div className="relative h-36 w-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dest.thumbnail}
                      alt={dest.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-sky-50 to-violet-50">
                    <MapPin className="h-8 w-8 text-sky-600" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {dest.name}
                      </h3>
                      <p className="truncate text-[11px] font-semibold text-sky-700">
                        <MapPin className="mr-0.5 inline h-3 w-3" />
                        {getDivisionName(dest.division)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${
                        dest.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                      }`}
                    >
                      {dest.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {dest.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {dest.description}
                    </p>
                  )}

                  <div className="mt-3 flex justify-end gap-1.5 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(dest)}
                      disabled={isDeleting}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:opacity-60"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(dest)}
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            No destinations {searchQuery ? "matching your search" : "yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Add a destination inside a division to start creating tours.
          </p>
        </div>
      )}
    </div>
  );
};

const inputCls =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

export default DestinationManagement;
