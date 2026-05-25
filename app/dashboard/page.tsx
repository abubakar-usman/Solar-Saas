// ============================================================
// FILE 13 — app/dashboard/page.tsx  (UPDATED — replaces File 08)
// Place at: <project-root>/app/dashboard/page.tsx
// ============================================================

import Link from "next/link";
import { Suspense } from "react";
import {
  Sun,
  Plus,
  ClipboardCheck,
  Zap,
  Wifi,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/project-card";
import { getActiveProjects } from "@/app/actions/project-actions";
import { getSessionUser } from "@/lib/auth";

// ─────────────────────────────────────────────
// ANIMATED HERO BANNER
// ─────────────────────────────────────────────

function HeroBanner({ userName }: { userName: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 p-8 shadow-xl">
      {/* Background decorative circles */}
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/20 animate-spin-slow" />
      <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-emerald-400/10 animate-spin-slow" style={{ animationDirection: "reverse" }} />
      <div className="absolute right-24 bottom-4 h-20 w-20 rounded-full bg-white/5 animate-float" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in-up">
          {/* Greeting */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-100 animate-pulse-glow">
              🌞 Solar Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome back, {userName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-emerald-200 text-sm">
            Manage your solar installations across Pakistan
          </p>
        </div>

        {/* Animated sun icon */}
        <div className="animate-float hidden sm:flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Sun className="h-10 w-10 text-amber-300" />
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-3 animate-fade-in-up delay-200">
        <Button
          asChild
          size="sm"
          className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold shadow-md"
        >
          <Link href="/dashboard/projects/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Link href="/dashboard/survey">
            <ClipboardCheck className="mr-1.5 h-4 w-4" />
            Site Survey
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Link href="/contact">
            <ArrowRight className="mr-1.5 h-4 w-4" />
            Contact Us
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  delay: string;
}) {
  return (
    <div
      className={`animate-fade-in-up ${delay} flex items-center gap-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200`}
    >
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECT GRID
// ─────────────────────────────────────────────

async function ProjectGrid({ filter }: { filter?: string }) {
  const projects = await getActiveProjects();

  const filtered =
    filter && filter !== "ALL"
      ? projects.filter((p) => p.status === filter)
      : projects;

  const counts = {
    SURVEY: projects.filter((p) => p.status === "SURVEY").length,
    INSTALLATION: projects.filter((p) => p.status === "INSTALLATION").length,
    NET_METERING: projects.filter((p) => p.status === "NET_METERING").length,
    total: projects.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={LayoutDashboard} label="Active Projects" value={counts.total}      color="bg-emerald-700" delay="delay-100" />
        <StatCard icon={ClipboardCheck}  label="Site Surveys"    value={counts.SURVEY}     color="bg-amber-500"   delay="delay-200" />
        <StatCard icon={Zap}             label="Installations"   value={counts.INSTALLATION} color="bg-blue-500"  delay="delay-300" />
        <StatCard icon={Wifi}            label="Net Metering"    value={counts.NET_METERING} color="bg-violet-500" delay="delay-400" />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between animate-fade-in delay-400">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-emerald-600" />
          <h2 className="text-base font-semibold text-slate-800">
            Active Installations
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          {counts.total} projects running
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 animate-fade-in delay-500">
        {[
          { value: "ALL", label: "All" },
          { value: "SURVEY", label: "Survey" },
          { value: "INSTALLATION", label: "Installation" },
          { value: "NET_METERING", label: "Net Metering" },
          { value: "ON_HOLD", label: "On Hold" },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "ALL" ? "/dashboard" : `/dashboard?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              (filter ?? "ALL") === tab.value
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white border border-emerald-100 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-20 animate-fade-in">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 animate-float">
            <Sun className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-base font-medium text-slate-600">No projects found</p>
          <p className="mt-1 text-sm text-slate-400">Create your first solar project to get started</p>
          <Button asChild className="mt-5 bg-emerald-700 hover:bg-emerald-800">
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i + 5) * 80}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

interface DashboardPageProps {
  searchParams: { status?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 shadow-md animate-pulse-glow">
              <Sun className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <span className="text-sm font-bold text-emerald-900">SolarPro</span>
              <span className="ml-1 text-sm text-slate-400 font-normal">Pakistan</span>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <Link href="/dashboard" className="text-emerald-700 font-medium">Dashboard</Link>
            <Link href="/dashboard/survey" className="hover:text-emerald-700 transition-colors">Survey</Link>
            <Link href="/contact" className="hover:text-emerald-700 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 hidden sm:inline">{user.name}</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hero */}
        <HeroBanner userName={user.name} />

        {/* Projects */}
        <Suspense fallback={<DashboardSkeleton />}>
          <ProjectGrid filter={searchParams.status} />
        </Suspense>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[260px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Dashboard | SolarPro Pakistan",
};
