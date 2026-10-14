"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Tours", href: "/tours" },
  { label: "Destinations", href: "/divisions" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavbarLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
    </nav>
  );
}
