import AllToursSection from "@/components/modules/ExploreTours/AllToursSection/AllToursSection";
import TourDiscoverySection from "@/components/modules/ExploreTours/TourDiscoverySection/TourDiscoverySection";
import ToursHeroSection from "@/components/modules/ExploreTours/ToursHeroSection";
import { getTours } from "@/services/tour/getTours";

const ToursPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) => {
  const params = await searchParams;

  const query: Record<string, string> = {
    status: "published",
    limit: "100",
  };

  if (params.search) query.search = params.search;
  if (params.category) query.category = params.category;
  if (params.maxPrice) query.maxPrice = params.maxPrice;

  const { tours } = await getTours(query);

  return (
    <div>
      <ToursHeroSection />
      <TourDiscoverySection />
      <AllToursSection tours={tours} />
    </div>
  );
};

export default ToursPage;
