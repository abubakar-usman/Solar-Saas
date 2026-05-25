// ============================================================
// FILE 08 — app/dashboard/page.tsx
// Place at: <project-root>/app/dashboard/page.tsx
// This is a React Server Component — no "use client" needed.
// ============================================================

import Link from "next/link";
import { Suspense } from "react";
import {
  LayoutDashboard,
  Plus,
  Sun,
  Zap,
  ClipboardCheck,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/project-card";
import { getActiveProjects } from "@/app/actions/project-actions";
import { getSessionUser } from "@/lib/auth";
import { ProjectStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`rounded-lg p-2.5 ${color}`}>
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
// PROJECT GRID  (async sub-component)
// ─────────────────────────────────────────────

async function ProjectGrid({ filter }: { filter?: string }) {
  const projects = await getActiveProjects();

  const filtered =
    filter && filter !== "ALL"
      ? projects.filter((p) => p.status === filter)
      : projects;

  // Stats derived from full list
  const counts = {
    SURVEY: projects.filter((p) => p.status === "SURVEY").length,
    INSTALLATION: projects.filter((p) => p.status === "INSTALLATION").length,
    NET_METERING: projects.filter((p) => p.status === "NET_METERING").length,
    total: projects.length,
  };

  return (
    <>
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={LayoutDashboard}
          label="Active Projects"
          value={counts.total}
          color="bg-slate-700"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Site Surveys"
          value={counts.SURVEY}
          color="bg-amber-500"
        />
        <StatCard
          icon={Sun}
          label="Installations"
          value={counts.INSTALLATION}
          color="bg-blue-500"
        />
        <StatCard
          icon={Wifi}
          label="Net Metering"
          value={counts.NET_METERING}
          color="bg-violet-500"
        />
      </div>

      {/* ── Project Cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-20">
          <Sun className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-base font-medium text-slate-500">
            No projects found
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Create your first project to get started
          </p>
          <Button asChild className="mt-5">
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

interface DashboardPageProps {
  searchParams: { status?: string };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getSessionUser();
  const statusFilter = searchParams.status;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <Sun className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              SolarPro <span className="text-slate-400 font-normal">Pakistan</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">{user.name}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Project Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your active solar installations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <form method="get" action="/dashboard">
              <Select name="status" defaultValue={statusFilter ?? "ALL"}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Stages</SelectItem>
                  <SelectItem value="SURVEY">Site Survey</SelectItem>
                  <SelectItem value="INSTALLATION">Installation</SelectItem>
                  <SelectItem value="NET_METERING">Net Metering</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </form>

            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/dashboard/survey">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Site Survey
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="space-y-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <ProjectGrid filter={statusFilter} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat skeletons */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-xl" />
        ))}
      </div>
      {/* Card skeletons */}
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
  description: "Manage your solar installation projects",
};
