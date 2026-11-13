import { getAllDestinations } from "@/services/destination/getAllDestinations";
import { getAllDivisions } from "@/services/division/getAllDivisions";
import ExploreDestinationsClient from "./ExploreDestinationsClient";

const ExploreDestinationsSection = async () => {
  const [{ destinations }, { divisions }] = await Promise.all([
    getAllDestinations({ limit: "100", sort: "-createdAt" }),
    getAllDivisions({ limit: "50", sort: "name" }),
  ]);

  if (destinations.length === 0) return null;

  return (
    <ExploreDestinationsClient
      destinations={destinations}
      divisions={divisions}
    />
  );
};

export default ExploreDestinationsSection;
