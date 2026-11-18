"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Tours", href: "/tours" },
  { label: "Destinations", href: "/destination" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavbarLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAIActive = isActive("/ai-planner");

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {navLinks.map((link) => {
        const active = isActive(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              active
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-sky-50/80 hover:text-sky-700"
            }`}
          >
            {link.label}

            {active && (
              <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
            )}
          </Link>
        );
      })}

      {/* ✨ AI Planner — Highlighted Button */}
      <Link
        href="/ai-planner"
        aria-current={isAIActive ? "page" : undefined}
        className={`group relative ml-2 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
          isAIActive
            ? "bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-lg shadow-violet-500/30"
            : "bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-md shadow-violet-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
        }`}
      >
        <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span>AI Planner</span>
        <span className="ml-0.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
          New
        </span>
      </Link>
    </nav>
  );
}
