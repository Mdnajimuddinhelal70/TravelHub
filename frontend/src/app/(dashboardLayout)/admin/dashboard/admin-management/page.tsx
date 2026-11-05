import { redirect } from "next/navigation";

import AdminManagementTable from "@/components/modules/Admin/AdminManagement/AdminManagementTable";
import { getAdmins } from "@/services/admin/getAdmins";
import { getMe } from "@/services/user/getMe";

const AdminManagementPage = async () => {
  const me = await getMe();
  if (!me) redirect("/login");

  // Only SUPER_ADMIN can access this page
  if (me.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const { admins } = await getAdmins({ limit: "100" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Admin Management
        </h1>
        <p className="text-sm text-slate-600">
          Manage admin accounts, promote users, or revoke admin privileges.
        </p>
      </div>

      <AdminManagementTable admins={admins} currentUserRole="SUPER_ADMIN" />
    </div>
  );
};

export default AdminManagementPage;
