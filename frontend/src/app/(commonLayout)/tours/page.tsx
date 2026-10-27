import AllToursSection from "@/components/modules/ExploreTours/AllToursSection/AllToursSection";
import TourDiscoverySection from "@/components/modules/ExploreTours/TourDiscoverySection/TourDiscoverySection";
import ToursHeroSection from "@/components/modules/ExploreTours/ToursHeroSection";
import { getTours } from "@/services/tour/getTours";

const ToursPage = async () => {
  const { tours } = await getTours({ status: "published", limit: "100" });
  console.log(tours);
  return (
    <div>
      <ToursHeroSection />
      <TourDiscoverySection />
      <AllToursSection tours={tours} />
    </div>
  );
};

export default ToursPage;
