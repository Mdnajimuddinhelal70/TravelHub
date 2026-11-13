import { getAllDestinations } from "@/services/destination/getAllDestinations";
import DestinationsHeroClient from "./DestinationsHeroClient";

const DestinationsHeroSection = async () => {
  const { destinations } = await getAllDestinations({
    limit: "3",
    sort: "-createdAt",
  });

  return <DestinationsHeroClient destinations={destinations} />;
};

export default DestinationsHeroSection;
