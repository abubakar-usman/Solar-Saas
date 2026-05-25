// ============================================================
// FILE 05 — app/actions/survey-actions.ts
// Place at: <project-root>/app/actions/survey-actions.ts
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { RoofType } from "@prisma/client";

// ─────────────────────────────────────────────
// VALIDATION SCHEMA
// ─────────────────────────────────────────────

const SiteSurveySchema = z.object({
  projectId: z.string().cuid("Invalid project ID"),
  roofType: z.nativeEnum(RoofType),
  roofAreaSqFt: z.coerce.number().positive().optional(),
  roofCondition: z.string().optional(),
  monthlyUnitsKwh: z.coerce
    .number()
    .positive("Monthly units must be a positive number"),
  peakSunHours: z.coerce.number().min(1).max(12).optional(),
  gridAvailable: z.coerce.boolean().default(true),
  netMeteringReady: z.coerce.boolean().default(false),
  existingSystem: z.coerce.boolean().default(false),
  shadingIssues: z.coerce.boolean().default(false),
  notes: z.string().max(2000).optional(),
});

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─────────────────────────────────────────────
// SUBMIT SITE SURVEY
// ─────────────────────────────────────────────

export async function submitSiteSurvey(
  formData: FormData
): Promise<ActionResult<{ surveyId: string }>> {
  const user = await getSessionUser();

  // ── Parse & validate ───────────────────────
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "image") continue; // handled separately
    raw[key] = value;
  }

  // Convert checkbox values ("on" / null) to boolean
  ["gridAvailable", "netMeteringReady", "existingSystem", "shadingIssues"].forEach(
    (field) => {
      raw[field] = formData.get(field) === "on";
    }
  );

  const parsed = SiteSurveySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  const { projectId, roofType, monthlyUnitsKwh, ...surveyData } = data;

  // ── Verify project belongs to this org ─────
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: user.organizationId },
    select: { id: true, status: true },
  });

  if (!project) {
    return { success: false, error: "Project not found or access denied." };
  }

  // ── Upsert survey (re-submittable) ──────────
  try {
    const survey = await prisma.siteSurvey.upsert({

      where: { projectId },
      create: {
        roofType,
        monthlyUnitsKwh,
        ...surveyData,
        project: { connect: { id: projectId } },
        conductedBy: { connect: { id: user.id } },
      },
      update: {
        roofType,
        monthlyUnitsKwh,
        ...surveyData,
        conductedBy: { connect: { id: user.id } },
        conductedAt: new Date(),
      },
      select: { id: true },
    });

    // ── Handle image uploads (placeholder) ─────
    // In production: iterate over formData.getAll("images"),
    // upload each to S3 / Cloudflare R2, then create SurveyImage records.
    // const imageFiles = formData.getAll("images") as File[];
    // await uploadSurveyImages(survey.id, imageFiles);

    // ── Move project to INSTALLATION if still SURVEY ──
    if (project.status === "SURVEY") {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "INSTALLATION", surveyDate: new Date() },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, data: { surveyId: survey.id } };
  } catch (err) {
    console.error("[submitSiteSurvey]", err);
    return { success: false, error: "Failed to save survey. Please try again." };
  }
}

// ─────────────────────────────────────────────
// GET SURVEY BY PROJECT ID
// ─────────────────────────────────────────────

export async function getSurveyByProject(projectId: string) {
  const user = await getSessionUser();

  return prisma.siteSurvey.findFirst({
    where: {
      projectId,
      project: { organizationId: user.organizationId }, // ← tenant isolation
    },
    include: {
      images: true,
      conductedBy: { select: { id: true, name: true } },
    },
  });
}

export async function createSurvey(payload: {
  projectId: string;
  conductedById: string;
  roofType: RoofType;
  monthlyUnitsKwh: number;
  notes?: string;
  roofAreaSqFt?: number;
  roofCondition?: string;
  peakSunHours?: number;
  gridAvailable?: boolean;
  netMeteringReady?: boolean;
  existingSystem?: boolean;
  shadingIssues?: boolean;
}) {
  const { conductedById, projectId, ...rest } = payload;

  return await prisma.siteSurvey.create({
    data: {
      ...rest,
      conductedBy: { connect: { id: conductedById } },
      project: { connect: { id: projectId } },
    },
  });
}
