import { redirect } from "next/navigation";

import ProfileForm from "@/components/modules/Profile/ProfileForm";
import { getMe } from "@/services/user/getMe";

const MyProfilePage = async () => {
  const user = await getMe();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          My Profile
        </h1>
        <p className="text-sm text-slate-600">
          Update your personal information and profile picture.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <ProfileForm user={user} />
      </div>
    </div>
  );
};

export default MyProfilePage;
