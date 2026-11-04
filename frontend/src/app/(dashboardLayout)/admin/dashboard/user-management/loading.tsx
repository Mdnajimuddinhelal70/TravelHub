import { TableSkeleton } from "@/components/shared/LoadingSkeleton";

const UserManagementLoading = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-4 w-80 animate-pulse rounded-lg bg-slate-200" />
    </div>
    <div className="flex flex-wrap gap-3">
      <div className="h-11 w-72 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200" />
    </div>
    <TableSkeleton rows={10} cols={5} />
  </div>
);

export default UserManagementLoading;
