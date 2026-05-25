// ============================================================
// FILE 09 — components/site-survey-form.tsx
// Place at: <project-root>/components/site-survey-form.tsx
// ============================================================

"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { submitSiteSurvey } from "@/app/actions/survey-actions";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ROOF_TYPES = [
  { value: "FLAT", label: "Flat / RCC" },
  { value: "SLANTED", label: "Slanted / Pitched" },
  { value: "HIP", label: "Hip Roof" },
  { value: "SHED", label: "Shed / Lean-to" },
  { value: "MIXED", label: "Mixed" },
] as const;

const ROOF_CONDITIONS = ["Excellent", "Good", "Fair", "Poor"] as const;

// ─────────────────────────────────────────────
// IMAGE PREVIEW
// ─────────────────────────────────────────────

type PreviewImage = { file: File; url: string; id: string };

function ImagePreviewGrid({
  images,
  onRemove,
}: {
  images: PreviewImage[];
  onRemove: (id: string) => void;
}) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.file.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(img.id)}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────

interface SiteSurveyFormProps {
  projectId: string;
  projectTitle?: string;
  defaultValues?: {
    roofType?: string;
    monthlyUnitsKwh?: number;
    roofCondition?: string;
    notes?: string;
  };
}

export function SiteSurveyForm({
  projectId,
  projectTitle,
  defaultValues,
}: SiteSurveyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview images state
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  // Select component state for FormData integration
  const [roofType, setRoofType] = useState<string>(defaultValues?.roofType ?? "");
  const [roofCondition, setRoofCondition] = useState<string>(defaultValues?.roofCondition ?? "");

  // Form state
  const [formState, setFormState] = useState<{
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }>({});

  // ── Image handling ──────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newPreviews: PreviewImage[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function removeImage(id: string) {
    setPreviewImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  // ── Submit ──────────────────────────────────
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append preview image files
    previewImages.forEach((img) => {
      formData.append("images", img.file);
    });

    startTransition(async () => {
      const result = await submitSiteSurvey(formData);
      if (result.success) {
        setFormState({ success: true });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setFormState({
          error: result.error,
          fieldErrors: result.fieldErrors,
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden project ID */}
      <input type="hidden" name="projectId" value={projectId} />

      {/* ── Success banner ── */}
      {formState.success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Survey saved! Redirecting to dashboard…
          </p>
        </div>
      )}

      {/* ── Error banner ── */}
      {formState.error && !formState.success && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{formState.error}</p>
        </div>
      )}

      {/* ═══════════════════════════════════════
          SECTION 1 — ROOF DETAILS
      ════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Roof Information</CardTitle>
          <CardDescription>
            Details about the installation roof structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Roof Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="roofType">
                Roof Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={roofType}
                onValueChange={setRoofType}
                required
              >
                <SelectTrigger id="roofType">
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOF_TYPES.map((rt) => (
                    <SelectItem key={rt.value} value={rt.value}>
                      {rt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="roofType" value={roofType} />
              {formState.fieldErrors?.roofType && (
                <p className="text-xs text-red-500">
                  {formState.fieldErrors.roofType[0]}
                </p>
              )}
            </div>

            {/* Roof Condition */}
            <div className="space-y-1.5">
              <Label htmlFor="roofCondition">Roof Condition</Label>
              <Select
                value={roofCondition}
                onValueChange={setRoofCondition}
              >
                <SelectTrigger id="roofCondition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {ROOF_CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="roofCondition" value={roofCondition} />
            </div>
          </div>

          {/* Roof Area */}
          <div className="space-y-1.5">
            <Label htmlFor="roofAreaSqFt">Roof Area (sq. ft.)</Label>
            <Input
              id="roofAreaSqFt"
              name="roofAreaSqFt"
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g. 800"
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
          SECTION 2 — ENERGY DETAILS
      ════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Energy Assessment</CardTitle>
          <CardDescription>
            Electricity consumption and grid information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Monthly Units */}
            <div className="space-y-1.5">
              <Label htmlFor="monthlyUnitsKwh">
                Average Monthly Units (kWh){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="monthlyUnitsKwh"
                name="monthlyUnitsKwh"
                type="number"
                min={1}
                step={0.1}
                placeholder="e.g. 450"
                defaultValue={defaultValues?.monthlyUnitsKwh}
                required
              />
              <p className="text-xs text-slate-400">
                Check last 3 months' WAPDA bills
              </p>
              {formState.fieldErrors?.monthlyUnitsKwh && (
                <p className="text-xs text-red-500">
                  {formState.fieldErrors.monthlyUnitsKwh[0]}
                </p>
              )}
            </div>

            {/* Peak Sun Hours */}
            <div className="space-y-1.5">
              <Label htmlFor="peakSunHours">Peak Sun Hours (PSH)</Label>
              <Input
                id="peakSunHours"
                name="peakSunHours"
                type="number"
                min={1}
                max={12}
                step={0.1}
                placeholder="e.g. 5.5"
                className="max-w-xs"
              />
              <p className="text-xs text-slate-400">
                Typically 4.5–6 hrs in Pakistan
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <Separator />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                id: "gridAvailable",
                name: "gridAvailable",
                label: "Grid Available",
                hint: "WAPDA / FESCO / LESCO connection exists",
              },
              {
                id: "netMeteringReady",
                name: "netMeteringReady",
                label: "Net Metering Ready",
                hint: "Site pre-approved for bi-directional metering",
              },
              {
                id: "existingSystem",
                name: "existingSystem",
                label: "Existing Solar System",
                hint: "Client already has panels / inverter installed",
              },
              {
                id: "shadingIssues",
                name: "shadingIssues",
                label: "Shading Issues Present",
                hint: "Trees, water tanks, or nearby structures cause shade",
              },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <Checkbox
                  id={item.id}
                  name={item.name}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={item.id} className="font-medium">
                    {item.label}
                  </Label>
                  <p className="text-xs text-slate-400">{item.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
          SECTION 3 — SITE IMAGES (placeholder)
      ════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Site Images</CardTitle>
          <CardDescription>
            Upload photos of the roof, meter, and surroundings (max 10 MB each)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 text-center transition-colors",
              "border-slate-200 bg-slate-50 text-slate-400",
              "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            )}
            aria-label="Upload images"
          >
            <ImagePlus className="h-10 w-10" />
            <div>
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs">PNG, JPG, WEBP · Max 10 MB each</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse files
            </Button>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            name="images"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Image preview grid */}
          <ImagePreviewGrid images={previewImages} onRemove={removeImage} />

          {previewImages.length > 0 && (
            <p className="text-xs text-slate-400">
              {previewImages.length} image{previewImages.length > 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
          SECTION 4 — NOTES
      ════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Survey Notes</CardTitle>
          <CardDescription>
            Additional observations for the installation team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            name="notes"
            placeholder="e.g. Water tank on NW corner, needs 4-inch gap. Client prefers hybrid inverter…"
            rows={4}
            defaultValue={defaultValues?.notes}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* ── Form Actions ── */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || formState.success}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Saving Survey…" : "Submit Survey"}
        </Button>
      </div>
    </form>
  );
}
