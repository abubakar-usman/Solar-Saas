// ============================================================
// FILE 15 — app/api/auth/[...nextauth]/route.ts
// Place at: app/api/auth/[...nextauth]/route.ts
// Create folders: app/api/auth/[...nextauth]/
// ============================================================

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch org info from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { organizationId: true, role: true },
        });

        session.user.organizationId = dbUser?.organizationId ?? null;
        session.user.role = dbUser?.role ?? "VIEWER";
      }
      return session;
    },
    async signIn({ user, account }: any) {
      // Auto-create an Organization for brand-new Google users
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { organizationId: true },
        });

        if (!existing?.organizationId) {
          // Create a default org for this user
          const org = await prisma.organization.create({
            data: {
              name: `${user.name}'s Organization`,
              slug: user.email!.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now(),
            },
          });

          // Link the user to the org
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              organizationId: org.id,
              role: "OWNER",
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database" as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
