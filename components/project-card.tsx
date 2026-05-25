// ============================================================
// FILE 07 — components/project-card.tsx
// Place at: <project-root>/components/project-card.tsx
// ============================================================

import Link from "next/link";
import { MapPin, Zap, User2, FileText, Package2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, StatusPipeline } from "@/components/ui/status-badge";
import { ProjectStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type ProjectCardData = {
  id: string;
  title: string;
  clientName: string;
  city: string;
  status: ProjectStatus;
  systemSizeKw: number | null;
  estimatedCost: number | null;
  updatedAt: Date;
  assignedEngineer: { id: string; name: string; avatarUrl: string | null } | null;
  survey: { id: string; roofType: string; monthlyUnitsKwh: number } | null;
  _count: { documents: number; items: number };
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectCardData;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md",
        className
      )}
    >
      {/* Accent bar based on status */}
      <div
        className={cn("absolute inset-x-0 top-0 h-0.5", {
          "bg-amber-400": project.status === "SURVEY",
          "bg-blue-500": project.status === "INSTALLATION",
          "bg-violet-500": project.status === "NET_METERING",
          "bg-emerald-500": project.status === "COMPLETED",
          "bg-slate-300": project.status === "ON_HOLD",
        })}
      />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="block truncate text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors"
            >
              {project.title}
            </Link>
            <p className="mt-0.5 truncate text-sm text-slate-500">
              {project.clientName}
            </p>
          </div>
          <StatusBadge status={project.status} className="shrink-0" />
        </div>

        {/* Pipeline progress */}
        <div className="mt-3">
          <StatusPipeline current={project.status} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{project.city}</span>
        </div>

        {/* System size & cost */}
        <div className="grid grid-cols-2 gap-3">
          {project.systemSizeKw != null && (
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-400">System Size</p>
              <p className="text-sm font-semibold text-slate-800">
                {project.systemSizeKw} kW
              </p>
            </div>
          )}
          {project.estimatedCost != null && (
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-400">Est. Cost</p>
              <p className="text-sm font-semibold text-slate-800">
                {formatPKR(project.estimatedCost)}
              </p>
            </div>
          )}
          {project.survey && (
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-400">Monthly Units</p>
              <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                <Zap className="h-3 w-3 text-amber-500" />
                {project.survey.monthlyUnitsKwh} kWh
              </p>
            </div>
          )}
        </div>

        {/* Meta counts */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {project._count.documents} docs
          </span>
          <span className="flex items-center gap-1">
            <Package2 className="h-3.5 w-3.5" />
            {project._count.items} items
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
        <div className="flex w-full items-center justify-between">
          {/* Assigned engineer */}
          {project.assignedEngineer ? (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-blue-100 text-xs text-blue-600">
                  {initials(project.assignedEngineer.name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[120px]">
                {project.assignedEngineer.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User2 className="h-3.5 w-3.5" />
              Unassigned
            </div>
          )}

          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
