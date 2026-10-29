import ChangePasswordForm from "@/components/modules/Profile/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Change Password
        </h1>
        <p className="text-sm text-slate-600">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
