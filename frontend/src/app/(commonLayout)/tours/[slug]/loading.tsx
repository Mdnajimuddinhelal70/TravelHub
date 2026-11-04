import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";

const TourDetailLoading = () => (
  <div className="px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <DetailSkeleton />
    </div>
  </div>
);

export default TourDetailLoading;
