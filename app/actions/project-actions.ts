// ============================================================
// FILE 04 — app/actions/project-actions.ts
// Place at: <project-root>/app/actions/project-actions.ts
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ProjectStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// VALIDATION SCHEMAS
// ─────────────────────────────────────────────

const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  clientName: z.string().min(2, "Client name required"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  systemSizeKw: z.coerce.number().positive().optional(),
  estimatedCost: z.coerce.number().positive().optional(),
  notes: z.string().optional(),
  assignedEngineerId: z.string().optional(),
});

const UpdateStatusSchema = z.object({
  projectId: z.string().cuid(),
  status: z.nativeEnum(ProjectStatus),
});

// ─────────────────────────────────────────────
// ACTION RESULT TYPE
// ─────────────────────────────────────────────

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─────────────────────────────────────────────
// CREATE PROJECT
// ─────────────────────────────────────────────

export async function createProject(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();

  const raw = Object.fromEntries(formData.entries());
  const parsed = CreateProjectSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        ...data,
        clientEmail: data.clientEmail || null,
        organization: { connect: { id: user.organizationId } }, // ← tenant isolation
        createdById: user.id,
        status: "SURVEY",
      },
      select: { id: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { id: project.id } };
  } catch (err) {
    console.error("[createProject]", err);
    return { success: false, error: "Failed to create project." };
  }
}

// ─────────────────────────────────────────────
// UPDATE PROJECT STATUS
// ─────────────────────────────────────────────

export async function updateProjectStatus(
  formData: FormData
): Promise<ActionResult> {
  const user = await getSessionUser();

  const parsed = UpdateStatusSchema.safeParse({
    projectId: formData.get("projectId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { projectId, status } = parsed.data;

  // Verify project belongs to this org before mutating
  const existing = await prisma.project.findFirst({
    where: { id: projectId, organizationId: user.organizationId },
    select: { id: true },
  });

  if (!existing) {
    return { success: false, error: "Project not found" };
  }

  const dateFields: Partial<Record<string, Date>> = {};
  if (status === "INSTALLATION") dateFields.installStartDate = new Date();
  if (status === "NET_METERING") dateFields.netMeteringDate = new Date();
  if (status === "COMPLETED") dateFields.completedAt = new Date();

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { status, ...dateFields },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateProjectStatus]", err);
    return { success: false, error: "Failed to update status." };
  }
}

// ─────────────────────────────────────────────
// GET PROJECTS (for dashboard — Server Component helper)
// ─────────────────────────────────────────────

export async function getActiveProjects() {
  const user = await getSessionUser();

  return prisma.project.findMany({
    where: {
      organizationId: user.organizationId, // ← tenant isolation
      status: { not: "COMPLETED" },
    },
    include: {
      assignedEngineer: { select: { id: true, name: true, avatarUrl: true } },
      survey: { select: { id: true, roofType: true, monthlyUnitsKwh: true } },
      _count: { select: { documents: true, items: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ─────────────────────────────────────────────
// DELETE PROJECT
// ─────────────────────────────────────────────

export async function deleteProject(
  formData: FormData
): Promise<ActionResult> {
  const user = await getSessionUser();
  const projectId = formData.get("projectId") as string;

  if (!projectId) return { success: false, error: "Project ID required" };

  const existing = await prisma.project.findFirst({
    where: { id: projectId, organizationId: user.organizationId },
    select: { id: true },
  });

  if (!existing) return { success: false, error: "Project not found" };

  try {
    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[deleteProject]", err);
    return { success: false, error: "Failed to delete project." };
  }
}
