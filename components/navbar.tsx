// ============================================================
// FILE 18 — components/navbar.tsx
// Place at: components/navbar.tsx
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Sun,
  LayoutDashboard,
  Phone,
  Home,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ClipboardCheck,
  Package2,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "/",           label: "Home",      icon: Home },
  { href: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/survey", label: "Survey", icon: ClipboardCheck },
  { href: "/contact",    label: "Contact",   icon: Phone },
];

function initials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 shadow-md group-hover:bg-emerald-600 transition-colors">
            <Sun className="h-5 w-5 text-amber-300" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold text-emerald-900">SolarPro</span>
            <span className="ml-1 text-base text-slate-400 font-normal">Pakistan</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            /* Logged in — show avatar dropdown */
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session.user.image ?? ""} />
                  <AvatarFallback className="bg-emerald-200 text-emerald-800 text-xs">
                    {initials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-emerald-600" />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-100 bg-white shadow-xl z-50">
                  {/* User info */}
                  <div className="border-b border-emerald-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/survey"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Site Survey
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User2 className="h-4 w-4" />
                      My Profile
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-emerald-50 p-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in */
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white hidden sm:flex">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {!session?.user && (
            <div className="pt-2 border-t border-emerald-50 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-emerald-700 hover:bg-emerald-800">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
