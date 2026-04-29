import AttractionSection from "@/components/modules/AttractionSection/AttractionSection";
import CTABanner from "@/components/modules/CTABanner/CTABanner";
import FeaturesSection from "@/components/modules/FeatureSection/FeaturesSection";
import HeroBanner from "@/components/modules/Home/HeroBanner";
import HowItWorksSection from "@/components/modules/HowItWorks/HowItWorksSection";
import TestimonialsSection from "@/components/modules/Testimonials/TestimonialsSection";

export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <AttractionSection />
        <CTABanner />
      </main>
    </>
  );
}
