import UserManagementTable from "@/components/modules/Admin/User/UserManagementTable";
import { getAllUsers } from "@/services/user/getAllUsers";
import { getMe } from "@/services/user/getMe";
import { redirect } from "next/navigation";

const UserManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    role?: string;
    isActive?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await searchParams;

  const me = await getMe();
  if (!me) redirect("/login");

  // Only ADMIN and SUPER_ADMIN can access
  if (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const { users, meta } = await getAllUsers({
    search: params.search,
    role: params.role,
    isActive: params.isActive,
    page: params.page ?? "1",
    limit: params.limit ?? "15",
    sort: "-createdAt",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          User Management
        </h1>
        <p className="text-sm text-slate-600">
          Manage user roles, block abusive accounts, or delete inactive users.
        </p>
      </div>

      <UserManagementTable
        users={users}
        meta={meta}
        currentUserRole={me.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "GUIDE"}
      />
    </div>
  );
};

export default UserManagementPage;
