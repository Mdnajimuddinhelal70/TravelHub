import FeaturedTourPackagesSection from "@/components/modules/FeaturedTourPackagesSection/FeaturedTourPackagesSection";
import FeaturesSection from "@/components/modules/FeatureSection/FeaturesSection";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import HowItWorksSection from "@/components/modules/HowItWorks/HowItWorksSection";
import PopularDestinationsSection from "@/components/modules/PopularDestinationsSection/PopularDestinationsSection";
import TestimonialsSection from "@/components/modules/Testimonials/TestimonialsSection";
import WhyChooseUsSection from "@/components/modules/WhyChooseUsSection/WhyChooseUsSection";
import { getTours } from "@/services/tour/getTours";

export default async function Home() {
  const { tours: featuredTours } = await getTours({
    status: "published",
    limit: "3",
    sort: "-createdAt",
  });
  return (
    <>
      <main>
        <HeroBanner />
        <FeaturesSection />
        <FeaturedTourPackagesSection tours={featuredTours} />
        <HowItWorksSection />
        <TestimonialsSection />
        <PopularDestinationsSection />
        <WhyChooseUsSection />
      </main>
    </>
  );
}
