import { Compass } from "lucide-react";
import Link from "next/link";

export default function NavbarLogo() {
  return (
    <Link
      href="/"
      aria-label="TravelHub home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-500 to-indigo-500 text-white shadow-lg shadow-sky-200/70 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
        <Compass className="size-6" strokeWidth={2.2} />
      </span>

      <span className="text-[1.4rem] font-extrabold tracking-tight text-slate-900">
        Travel
        <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
          Hub
        </span>
      </span>
    </Link>
  );
}
