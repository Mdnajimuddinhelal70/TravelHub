"use client";

import {
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { logoutUser } from "@/services/auth/logoutUser";
import type { IUserProfile } from "@/services/user/getMe";

interface Props {
  user: IUserProfile;
  /** mobile-এ close callback (যদি mobile navbar-এ থাকে) */
  onNavigate?: () => void;
}

const UserMenu = ({ user, onNavigate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const initial = (user.name?.charAt(0) || "U").toUpperCase();
  const dashboardHref = getDefaultDashboardRoute(
    user.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "GUIDE",
  );
  const isUser = user.role === "USER";
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  const menuItems = [
    {
      label: "Dashboard",
      href: dashboardHref,
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: isUser ? "/dashboard/my-profile" : "/my-profile",
      icon: User,
    },
    ...(isUser
      ? [
          {
            label: "My Bookings",
            href: "/dashboard/my-bookings",
            icon: CalendarCheck,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            href: "/admin/dashboard",
            icon: Shield,
          },
        ]
      : []),
  ];

  const handleNavigate = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-sm transition hover:border-sky-300 hover:shadow-md"
      >
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-sm font-extrabold text-sky-700">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt={user.name}
              className="size-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <span className="hidden max-w-[100px] truncate text-sm font-semibold text-slate-800 sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`hidden size-4 text-slate-400 transition sm:inline ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
        >
          {/* Header */}
          <div className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-violet-50 p-4">
            <p className="truncate text-sm font-bold text-slate-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-600">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
              {user.role.replace("_", " ")}
            </span>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
                >
                  <Icon className="size-4 text-slate-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
