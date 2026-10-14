"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarActions({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const router = useRouter();

  const navigate = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  return (
    <div className="flex items-center gap-2.5">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/login")}
        className="h-10 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
      >
        <LogIn className="mr-1.5 size-4" />
        Login
      </Button>

      <Button
        type="button"
        onClick={() => navigate("/register")}
        className="h-10 rounded-xl border-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-5 font-semibold text-white shadow-md shadow-sky-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200/70"
      >
        <UserPlus className="mr-1.5 size-4" />
        Register
      </Button>
    </div>
  );
}
