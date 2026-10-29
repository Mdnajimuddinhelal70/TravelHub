import DivisionManagement from "@/components/modules/Division/DivisionManagement";
import { getAllDivisions } from "@/services/division/getAllDivisions";

const AddDivisionPage = async () => {
  const { divisions } = await getAllDivisions({
    limit: "100",
    sort: "-createdAt",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Division Management
        </h1>
        <p className="text-sm text-slate-600">
          Add, edit, and manage divisions (geographic regions).
        </p>
      </div>

      <DivisionManagement initialDivisions={divisions} />
    </div>
  );
};

export default AddDivisionPage;
