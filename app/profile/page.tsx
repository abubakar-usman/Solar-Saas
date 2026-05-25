// ============================================================
// FILE 25 — app/profile/page.tsx
// Place at: app/profile/page.tsx
// Create folder: app/profile/
// ============================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { User2, Mail, Building2, Shield, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: { select: { name: true, slug: true } },
      _count: {
        select: {
          createdProjects: true,
          assignedProjects: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-emerald-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden animate-fade-in-up delay-100">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-emerald-700 to-emerald-600" />

          {/* Avatar + Name */}
          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? ""}
                  className="h-20 w-20 rounded-2xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-emerald-700 shadow-md text-2xl font-bold text-white">
                  {user.name?.[0] ?? "?"}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {user.role}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in-up delay-200">
          {[
            { icon: Mail,      label: "Email",        value: user.email ?? "—" },
            { icon: Building2, label: "Organization",  value: user.organization?.name ?? "—" },
            { icon: Shield,    label: "Role",          value: user.role },
            { icon: Calendar,  label: "Member Since",  value: new Date(user.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long" }) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-emerald-100 bg-white p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <item.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 animate-fade-in-up delay-300">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-center">
            <p className="text-3xl font-bold text-emerald-700">{user._count.createdProjects}</p>
            <p className="text-sm text-slate-500 mt-1">Projects Created</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{user._count.assignedProjects}</p>
            <p className="text-sm text-slate-500 mt-1">Projects Assigned</p>
          </div>
        </div>

      </main>
    </div>
  );
}

export const metadata = {
  title: "My Profile | SolarPro Pakistan",
};
