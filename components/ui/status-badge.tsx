// ============================================================
// FILE 06 — components/ui/status-badge.tsx
// Place at: <project-root>/components/ui/status-badge.tsx
// ============================================================

import { cn } from "@/lib/utils";
import { ProjectStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string; dot: string }
> = {
  SURVEY: {
    label: "Site Survey",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  INSTALLATION: {
    label: "Installation",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  NET_METERING: {
    label: "Net Metering",
    className: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}

// ── Progress pipeline (Survey → Installation → Net Metering) ──

const PIPELINE: ProjectStatus[] = ["SURVEY", "INSTALLATION", "NET_METERING", "COMPLETED"];

export function StatusPipeline({ current }: { current: ProjectStatus }) {
  const currentIdx = PIPELINE.indexOf(current);

  return (
    <div className="flex items-center gap-1" aria-label="Project pipeline">
      {PIPELINE.map((step, idx) => {
        const cfg = STATUS_CONFIG[step];
        const isComplete = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                isActive && cfg.dot,
                isComplete && "bg-emerald-400",
                !isActive && !isComplete && "bg-slate-200"
              )}
              title={cfg.label}
            />
            {idx < PIPELINE.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 transition-all",
                  isComplete ? "bg-emerald-300" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
