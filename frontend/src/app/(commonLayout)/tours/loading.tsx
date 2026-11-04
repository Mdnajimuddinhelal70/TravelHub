import { TourGridSkeleton } from "@/components/shared/LoadingSkeleton";

const ToursLoading = () => (
  <div className="px-4 py-20 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <TourGridSkeleton />
    </div>
  </div>
);

export default ToursLoading;
