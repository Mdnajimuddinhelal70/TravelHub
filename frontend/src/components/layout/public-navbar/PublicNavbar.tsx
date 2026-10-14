"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MobileNavbar from "./MobileNavbar";
import NavbarActions from "./NavbarActions";
import NavbarLinks from "./NavbarLinks";
import NavbarLogo from "./NavbarLogo";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the user presses Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="relative border-b border-sky-100/80 bg-white/90 shadow-[0_4px_24px_-12px_rgba(14,165,233,0.22)] backdrop-blur-xl"
      >
        {/* Gradient accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500"
        />

        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavbarLogo />

          <NavbarLinks />

          <div className="hidden items-center gap-3 lg:flex">
            <NavbarActions />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="travelhub-mobile-menu"
            onClick={() => setOpen((previous) => !previous)}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 text-slate-700 shadow-sm transition-all hover:border-sky-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div id="travelhub-mobile-menu">
          <MobileNavbar open={open} onClose={() => setOpen(false)} />
        </div>
      </nav>
    </header>
  );
}
