// ============================================================
// FILE 29 — app/register/page.tsx  (UPDATED with email form)
// Place at: app/register/page.tsx
// ============================================================

"use client";

import { useState, useTransition } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Sun, Loader2, Eye, EyeOff,
  CheckCircle2, Zap, Shield, Users, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const BENEFITS = [
  { icon: CheckCircle2, text: "Free to get started" },
  { icon: Zap,          text: "Set up your first project in 5 minutes" },
  { icon: Shield,       text: "Your data is private and encrypted" },
  { icon: Users,        text: "Invite your whole team" },
  { icon: TrendingUp,   text: "Track every project stage" },
];

export default function RegisterPage() {
  const { status } = useSession();
  const router     = useRouter();
  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            name:     form.name,
            email:    form.email,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Registration failed");
          return;
        }

        // Auto sign in after registration
        const result = await signIn("credentials", {
          email:    form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.ok) {
          setSuccess(true);
          router.push("/dashboard");
        } else {
          setError("Account created! Please sign in.");
          router.push("/login");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left: Form ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700">
              <Sun className="h-5 w-5 text-amber-300" />
            </div>
            <span className="text-xl font-bold text-emerald-900">SolarPro Pakistan</span>
          </div>

          <h1 className="mb-1 text-center text-2xl font-bold text-emerald-900">Create your account</h1>
          <p className="mb-6 text-center text-sm text-slate-500">Join 500+ solar installers</p>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Account created! Redirecting...
            </div>
          )}

          {/* Google Button */}
          <Button
            onClick={handleGoogle}
            disabled={isGoogleLoading || isPending}
            variant="outline"
            className="w-full h-11 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium mb-4"
          >
            {isGoogleLoading
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <GoogleIcon />
            }
            <span className="ml-2">Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or register with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name" name="name" type="text"
                placeholder="Ahmed Khan"
                value={form.name} onChange={handleChange}
                required
                className="border-emerald-200 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email" name="email" type="email"
                placeholder="ahmed@example.com"
                value={form.email} onChange={handleChange}
                required
                className="border-emerald-200 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={form.password} onChange={handleChange}
                  required
                  className="border-emerald-200 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword" name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword} onChange={handleChange}
                required
                className="border-emerald-200 h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || isGoogleLoading}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
            >
              {isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
                : "Create Account"
              }
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-600/30 animate-spin-slow" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`, backgroundSize: "32px 32px" }}
        />
        <div className="relative animate-fade-in-up">
          <Sun className="mb-6 h-12 w-12 text-amber-300 animate-float" />
          <h2 className="text-4xl font-bold text-white mb-4">Start managing solar projects the smart way</h2>
          <div className="mt-6 space-y-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <b.icon className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <p className="text-sm text-emerald-100">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[["500+","Installers"],["2,000+","Projects"],["50 MW+","Installed"],["98%","Satisfaction"]].map(([v,l]) => (
              <div key={l} className="rounded-xl bg-white/10 border border-white/10 p-3">
                <p className="text-xl font-bold text-white">{v}</p>
                <p className="text-xs text-emerald-300">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
