// ============================================================
// FILE 23 — app/page.tsx  (PUBLIC HOME / LANDING PAGE)
// Place at: app/page.tsx  (replace the existing one)
// ============================================================

import Link from "next/link";
import {
  Sun, Zap, Shield, Users, MapPin, CheckCircle2,
  ArrowRight, Star, Phone, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: Zap,
    title: "End-to-End Project Management",
    desc: "From site survey to net metering approval — track every stage of your solar installations in one place.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Shield,
    title: "Multi-Tenant Security",
    desc: "Every company's data is completely isolated. Your projects, clients, and inventory are private to your organization.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Add engineers, admins, and viewers. Assign projects, track surveys, and work together in real-time.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: MapPin,
    title: "Pakistan-Focused",
    desc: "Built for WAPDA, FESCO, LESCO, and IESCO zones. Net metering workflow follows NEPRA regulations.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const STEPS = [
  { num: "01", title: "Sign Up Free",       desc: "Create your account with Google in one click. No credit card needed." },
  { num: "02", title: "Add Your Project",   desc: "Enter client details, address, and estimated system size." },
  { num: "03", title: "Conduct Survey",     desc: "Fill the digital site survey — roof type, monthly units, shading issues." },
  { num: "04", title: "Track Installation", desc: "Move projects through Installation and Net Metering stages easily." },
];

const TESTIMONIALS = [
  {
    name: "Usman Malik",
    company: "Lahore Solar Co.",
    text: "SolarPro saved us hours of paperwork. Our engineers now submit site surveys from their phones.",
    rating: 5,
  },
  {
    name: "Fatima Zahra",
    company: "GreenWatt Karachi",
    text: "The net metering tracking is exactly what we needed. WAPDA document management is seamless.",
    rating: 5,
  },
  {
    name: "Ahmed Raza",
    company: "Islamabad Energy Solutions",
    text: "Best investment for our solar business. The dashboard shows everything at a glance.",
    rating: 5,
  },
];

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20">
      <Navbar />

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-3xl" />
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #10b98120 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                🇵🇰 Built for Pakistan's Solar Industry
              </div>

              {/* Headline */}
              <div className="animate-fade-in-up delay-100">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                  Solar Project
                  <br />
                  Management
                  <br />
                  <span className="text-emerald-600">Made Simple</span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                  The all-in-one platform for Pakistan's solar installers. Manage surveys, installations, inventory, and net metering — all in one dashboard.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-200 h-12 px-8 text-base font-semibold">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12 px-8 text-base">
                  <Link href="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-6 animate-fade-in-up delay-300">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["U", "F", "A", "Z"].map((l, i) => (
                      <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-xs font-bold text-white">
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-emerald-700">500+</span> installers trust us
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating count={5} />
                  <span className="text-sm text-slate-600 font-medium">4.9 / 5</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div className="animate-fade-in-up delay-300 relative">
              <div className="relative rounded-2xl border border-emerald-200 bg-white shadow-2xl shadow-emerald-100 overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-300" />
                    <span className="text-sm font-semibold text-white">SolarPro Dashboard</span>
                  </div>
                  <span className="text-xs text-emerald-200">Live</span>
                </div>
                {/* Stat preview */}
                <div className="grid grid-cols-2 gap-3 p-5">
                  {[
                    { label: "Active Projects", value: "24", color: "bg-emerald-50 text-emerald-700" },
                    { label: "Surveys Done", value: "8", color: "bg-amber-50 text-amber-700" },
                    { label: "Installing", value: "12", color: "bg-blue-50 text-blue-700" },
                    { label: "Net Metering", value: "4", color: "bg-violet-50 text-violet-700" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs font-medium opacity-80">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Project list preview */}
                <div className="px-5 pb-5 space-y-2">
                  {[
                    { name: "Khan Residence — Lahore", status: "Installing", color: "text-blue-600 bg-blue-50" },
                    { name: "Ali Commercial — Karachi", status: "Survey", color: "text-amber-600 bg-amber-50" },
                    { name: "Raza Factory — Faisalabad", status: "Net Metering", color: "text-violet-600 bg-violet-50" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5">
                      <p className="text-sm text-slate-700 font-medium truncate">{p.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.color}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 animate-float rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Net Metering Approved</p>
                    <p className="text-xs text-slate-500">Khan Residence · 2 mins ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-emerald-900">Everything you need</h2>
            <p className="mt-3 text-slate-500">Built specifically for Pakistan's solar market</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`animate-fade-in-up delay-${(i + 1) * 100} rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:border-emerald-200 transition-all duration-200`}
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900">Get started in 4 steps</h2>
            <p className="mt-3 text-slate-500">From sign-up to managing your first project in minutes</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`animate-fade-in-up delay-${(i + 1) * 100} text-center`}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-bold text-white shadow-lg shadow-emerald-200">
                  {step.num}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900">Loved by installers</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`animate-fade-in-up delay-${(i + 1) * 100} rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6`}
              >
                <StarRating count={t.rating} />
                <p className="mt-3 text-sm text-slate-600 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-700 p-12 text-center shadow-2xl shadow-emerald-200">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-spin-slow" />

            <div className="relative">
              <Sun className="mx-auto mb-4 h-12 w-12 text-amber-300 animate-float" />
              <h2 className="text-3xl font-bold text-white">Ready to power Pakistan?</h2>
              <p className="mt-3 text-emerald-200 text-lg">
                Join 500+ solar installers. Free to start — no credit card required.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold h-12 px-8 shadow-lg">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  <Link href="/contact">Talk to Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="border-t border-emerald-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700">
                  <Sun className="h-4 w-4 text-amber-300" />
                </div>
                <span className="font-bold text-emerald-900">SolarPro Pakistan</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pakistan's trusted solar installation management platform. AEDB Certified.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-800">Product</p>
              <div className="space-y-2">
                {["Dashboard", "Site Survey", "Inventory", "Net Metering"].map((l) => (
                  <Link key={l} href="/dashboard" className="block text-sm text-slate-500 hover:text-emerald-700 transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-800">Company</p>
              <div className="space-y-2">
                {[["Home", "/"], ["Contact", "/contact"], ["Login", "/login"], ["Register", "/register"]].map(([l, h]) => (
                  <Link key={l} href={h} className="block text-sm text-slate-500 hover:text-emerald-700 transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-800">Contact</p>
              <div className="space-y-2">
                <a href="tel:+923090003841" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700">
                  <Phone className="h-3.5 w-3.5" /> +92 309 0003841
                </a>
                <a href="mailto:abuxusman911@gmail.com" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700">
                  <Mail className="h-3.5 w-3.5" /> abuxusman911@gmail.com
                </a>
                <p className="text-xs text-slate-600 mt-1">Admin: Abubakar</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">© 2024 SolarPro Pakistan. All rights reserved.</p>
            <p className="text-xs text-slate-400">AEDB Certified · WAPDA Approved · NEPRA Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
