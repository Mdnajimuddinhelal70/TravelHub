import DestinationManagement from "@/components/modules/Admin/Destination/DestinationManagement";
import { getAllDestinations } from "@/services/destination/getAllDestinations";
import { getAllDivisions } from "@/services/division/getAllDivisions";

const AddDestinationPage = async () => {
  const [{ destinations }, { divisions }] = await Promise.all([
    getAllDestinations({ limit: "200", sort: "-createdAt" }),
    getAllDivisions({ limit: "100", sort: "-createdAt" }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Destination Management
        </h1>
        <p className="text-sm text-slate-600">
          Add and manage destinations inside your divisions.
        </p>
      </div>

      <DestinationManagement
        initialDestinations={destinations}
        divisions={divisions}
      />
    </div>
  );
};

export default AddDestinationPage;
