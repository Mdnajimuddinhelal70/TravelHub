import AITripPlannerPage from "@/components/modules/AI/AITripPlannerPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trip Planner | Travel Hub",
  description:
    "Let AI create a personalized day-by-day itinerary for your perfect trip",
};

const AIPlannerPage = () => {
  return <AITripPlannerPage />;
};

export default AIPlannerPage;
