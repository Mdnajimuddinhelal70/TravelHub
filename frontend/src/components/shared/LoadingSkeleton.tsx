const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

export const TourGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm"
      >
        <SkeletonBox className="h-[245px] w-full rounded-none sm:h-[255px]" />
        <div className="space-y-3 p-5">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-5 w-3/4" />
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-5/6" />
          <div className="flex justify-between pt-3">
            <SkeletonBox className="h-8 w-20" />
            <SkeletonBox className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({
  rows = 8,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} className="h-3 flex-1" />
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="space-y-6">
    <SkeletonBox className="h-96 w-full rounded-2xl" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <SkeletonBox className="h-6 w-32" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-11/12" />
        <SkeletonBox className="h-4 w-10/12" />
        <SkeletonBox className="mt-6 h-6 w-32" />
        <SkeletonBox className="h-20 w-full" />
        <SkeletonBox className="h-20 w-full" />
      </div>
      <div className="space-y-4">
        <SkeletonBox className="h-32 w-full rounded-2xl" />
        <SkeletonBox className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export const CardListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      >
        <SkeletonBox className="h-28 w-40 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3">
          <SkeletonBox className="h-3 w-32" />
          <SkeletonBox className="h-5 w-2/3" />
          <SkeletonBox className="h-3 w-1/2" />
          <div className="flex justify-between pt-4">
            <SkeletonBox className="h-8 w-24" />
            <SkeletonBox className="h-8 w-32" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const StatsCardsSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="w-full space-y-2">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-7 w-32" />
            <SkeletonBox className="h-3 w-40" />
          </div>
          <SkeletonBox className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "table" | "stats" | "cards" | "detail";
}) => {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <SkeletonBox className="h-8 w-56 sm:w-64" />
        <SkeletonBox className="h-4 w-80 sm:w-96" />
      </div>

      {/* Variant content */}
      {variant === "stats" && <StatsCardsSkeleton count={6} />}

      {variant === "table" && (
        <>
          <div className="flex flex-wrap gap-3">
            <SkeletonBox className="h-11 w-72" />
            <SkeletonBox className="h-11 w-40" />
            <SkeletonBox className="h-11 w-40" />
          </div>
          <TableSkeleton rows={10} cols={6} />
        </>
      )}

      {variant === "cards" && <CardListSkeleton count={3} />}

      {variant === "detail" && <DetailSkeleton />}

      {variant === "default" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="space-y-3">
                <SkeletonBox className="h-3 w-24" />
                <SkeletonBox className="h-7 w-32" />
                <SkeletonBox className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
