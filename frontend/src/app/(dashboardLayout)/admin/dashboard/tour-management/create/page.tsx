import TourForm from "@/components/modules/Admin/TourManagement/TourForm";
import { getTourFormOptions } from "@/services/tour/getTourFormOptions";

const CreateTourPage = async () => {
  const options = await getTourFormOptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Create Tour
        </h1>
        <p className="text-sm text-slate-600">
          Fill in the details to publish a new tour package.
        </p>
      </div>

      <TourForm
        tourTypes={options.tourTypes}
        divisions={options.divisions}
        destinations={options.destinations}
      />
    </div>
  );
};

export default CreateTourPage;
