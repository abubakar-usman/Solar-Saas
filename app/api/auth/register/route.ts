// ============================================================
// FILE 30 — app/api/auth/register/route.ts
// Place at: app/api/auth/register/route.ts
// Create folder: app/api/auth/register/
// ============================================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ── Validate ───────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ── Check existing user ────────────────────
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ── Hash password ──────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create Organization ────────────────────
    const slug =
      email.split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") +
      "-" + Date.now();

    const org = await prisma.organization.create({
      data: {
        name: `${name}'s Organization`,
        slug,
      },
    });

    // ── Create User ────────────────────────────
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role:           "OWNER",
        isActive:       true,
        organizationId: org.id,
      },
      select: {
        id:    true,
        name:  true,
        email: true,
        role:  true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register error]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
