import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import DepartureManagement from "@/components/modules/Admin/TourManagement/DepartureManagement";
import { getDeparturesForAdmin } from "@/services/tour-departure/getDeparturesForAdmin";
import { getTourBySlug } from "@/services/tour/getTourBySlug";

const TourDeparturesPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const departures = await getDeparturesForAdmin(tour._id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/dashboard/tour-management"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to tours
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Departures — {tour.title}
        </h1>
        <p className="text-sm text-slate-600">
          Manage available dates and seat availability for this tour.
        </p>
      </div>

      <DepartureManagement tour={tour} initialDepartures={departures} />
    </div>
  );
};

export default TourDeparturesPage;
