"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, LogIn, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Tours", href: "/tours" },
  { label: "Destinations", href: "/divisions" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface MobileNavbarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNavbar({ open, onClose }: MobileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="absolute inset-x-0 top-full border-t border-sky-100/80 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-xl lg:hidden">
      <div className="mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-indigo-50 p-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
              <Compass className="size-5" />
            </span>

            <div>
              <p className="font-bold text-slate-800">Your next adventure</p>
              <p className="text-xs text-slate-500">
                Discover places worth exploring.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="space-y-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-700"
                }`}
              >
                {link.label}

                <ArrowRight
                  className={`size-4 transition-transform ${
                    active ? "text-sky-600" : "text-slate-300"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/login")}
            className="h-11 rounded-xl border-slate-200 font-semibold"
          >
            <LogIn className="mr-2 size-4" />
            Login
          </Button>

          <Button
            type="button"
            onClick={() => navigate("/register")}
            className="h-11 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 font-semibold text-white shadow-md shadow-sky-200/60 hover:opacity-95"
          >
            <UserPlus className="mr-2 size-4" />
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
