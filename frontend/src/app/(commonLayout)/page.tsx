import FeaturedTourPackagesSection from "@/components/modules/FeaturedTourPackagesSection/FeaturedTourPackagesSection";
import FeaturesSection from "@/components/modules/FeatureSection/FeaturesSection";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import HowItWorksSection from "@/components/modules/HowItWorks/HowItWorksSection";
import PopularDestinationsSection from "@/components/modules/PopularDestinationsSection/PopularDestinationsSection";
import TestimonialsSection from "@/components/modules/Testimonials/TestimonialsSection";
import WhyChooseUsSection from "@/components/modules/WhyChooseUsSection/WhyChooseUsSection";

export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PopularDestinationsSection />
        <WhyChooseUsSection />
        <FeaturedTourPackagesSection />
      </main>
    </>
  );
}
