// ============================================================
// FILE 21 — app/login/page.tsx
// Place at: app/login/page.tsx
// Create folder: app/login/
// ============================================================

"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Loader2, AlertCircle, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// Google Icon SVG
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const FEATURES = [
  { icon: Zap, text: "Manage solar projects from survey to completion" },
  { icon: Shield, text: "Secure multi-tenant data isolation per company" },
  { icon: Users, text: "Collaborate with your entire installation team" },
];

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (errorParam === "OAuthAccountNotLinked") {
      setError("This email is already linked to another account.");
    } else if (errorParam) {
      setError("Something went wrong. Please try again.");
    }
  }, [errorParam]);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-600/30 animate-spin-slow" />
          <div className="absolute -left-16 bottom-20 h-60 w-60 rounded-full bg-emerald-500/20 animate-spin-slow" style={{ animationDirection: "reverse" }} />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3 animate-fade-in">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Sun className="h-6 w-6 text-amber-300 animate-float" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">SolarPro</p>
            <p className="text-sm text-emerald-300">Pakistan</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative space-y-6 animate-fade-in-up delay-200">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Power Pakistan
            <br />
            <span className="text-amber-300">with Solar Energy</span>
          </h1>
          <p className="text-emerald-200 text-lg leading-relaxed">
            The complete platform for solar installers — from site survey to net metering.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 animate-fade-in-up delay-${(i + 3) * 100}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-emerald-300" />
                </div>
                <p className="text-sm text-emerald-100">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative animate-fade-in delay-500">
          <p className="text-xs text-emerald-400">
            AEDB Certified · WAPDA Approved · Trusted by 500+ installers
          </p>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-white px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700">
              <Sun className="h-5 w-5 text-amber-300" />
            </div>
            <span className="text-xl font-bold text-emerald-900">SolarPro Pakistan</span>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-emerald-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your solar projects
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white border-2 border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm font-medium text-base transition-all"
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-emerald-600" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-3">
              {isLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">Secure sign-in via Google</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Info box */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-700 text-center leading-relaxed">
              🔒 We use Google OAuth for secure authentication. Your password is never stored on our servers.
            </p>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New to SolarPro?{" "}
            <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
              Create an account
            </Link>
          </p>

          {/* Back to home */}
          <p className="mt-3 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
