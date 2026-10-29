import { notFound } from "next/navigation";

import TourEditForm from "@/components/modules/Admin/TourManagement/TourEditForm";
import { getTourForEdit } from "@/services/tour/getTourById";
import { getTourFormOptions } from "@/services/tour/getTourFormOptions";

const EditTourPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const [tour, options] = await Promise.all([
    getTourForEdit(slug),
    getTourFormOptions(),
  ]);

  if (!tour) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Edit Tour
        </h1>
        <p className="text-sm text-slate-600">
          Update &quot;{tour.title}&quot; details.
        </p>
      </div>

      <TourEditForm
        tour={tour}
        tourTypes={options.tourTypes}
        divisions={options.divisions}
        destinations={options.destinations}
      />
    </div>
  );
};

export default EditTourPage;
