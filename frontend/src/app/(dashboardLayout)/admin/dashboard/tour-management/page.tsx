import { Plus } from "lucide-react";
import Link from "next/link";

import TourTable from "@/components/modules/Admin/TourManagement/TourTable";
import { getAllToursForAdmin } from "@/services/tour/getAllToursForAdmin";

const TourManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await searchParams;

  const { tours, meta } = await getAllToursForAdmin({
    search: params.search,
    status: params.status,
    page: params.page ?? "1",
    limit: params.limit ?? "10",
    sort: "-createdAt",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Tour Management
          </h1>
          <p className="text-sm text-slate-600">
            Create, edit, and manage all tour packages.
          </p>
        </div>
        <Link
          href="/admin/dashboard/tour-management/create"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Create tour
        </Link>
      </div>

      {/* Table */}
      <TourTable tours={tours} meta={meta} />
    </div>
  );
};

export default TourManagementPage;
