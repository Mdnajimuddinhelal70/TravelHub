import AllToursSection from "@/components/modules/ExploreTours/AllToursSection/AllToursSection";
import TourDiscoverySection from "@/components/modules/ExploreTours/TourDiscoverySection/TourDiscoverySection";
import ToursHeroSection from "@/components/modules/ExploreTours/ToursHeroSection";

const ToursPage = () => {
  return (
    <div>
      <ToursHeroSection />
      <TourDiscoverySection />
      <AllToursSection />
    </div>
  );
};

export default ToursPage;
