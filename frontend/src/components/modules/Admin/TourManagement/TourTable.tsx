"use client";

import { Calendar, Eye, Pencil, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteTour } from "@/services/tour/deleteTour";
import type { ITour, PaginationMeta } from "@/types";

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

const getStatusStyle = (status: string) => {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "draft":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "archived":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

interface Props {
  tours: ITour[];
  meta?: PaginationMeta;
}

const TourTable = ({ tours, meta }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`/admin/dashboard/tour-management?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", searchInput.trim());
  };

  const handleDelete = (tour: ITour) => {
    const confirmed = window.confirm(
      `Delete "${tour.title}"? This will soft-delete the tour.`,
    );
    if (!confirmed) return;

    setDeletingId(tour._id);
    startTransition(async () => {
      const result = await deleteTour(tour._id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setDeletingId(null);
    });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/dashboard/tour-management?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tours by title, description..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </form>

        <select
          value={currentStatus}
          onChange={(e) => updateQuery("status", e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:max-w-[180px]"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {tours.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tour</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tours.map((tour) => {
                  const isDeleting = deletingId === tour._id && isPending;
                  const cover =
                    tour.coverImage ||
                    tour.images?.[0] ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

                  return (
                    <tr key={tour._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={cover}
                              alt={tour.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {tour.title}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">
                              {tour.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">
                        {formatPrice(tour.price.adult)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {tour.duration.days}D / {tour.duration.nights}N
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                            tour.status,
                          )}`}
                        >
                          {tour.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatDate(tour.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/tours/${tour.slug}`}
                            // target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                            title="View on site"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/dashboard/tour-management/${tour.slug}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(tour)}
                            disabled={isDeleting}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          {/* Departures button */}
                          <Link
                            href={`/admin/dashboard/tour-management/${tour.slug}/departures`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                            title="Manage departures"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No tours found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your filters or create a new tour.
            </p>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-600">
              Page {meta.page} of {meta.totalPage} · {meta.total} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page <= 1}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page >= meta.totalPage}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourTable;
