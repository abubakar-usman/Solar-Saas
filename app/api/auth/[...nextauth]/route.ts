import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  // NO adapter line here
  providers: [
    // ── Google OAuth ──────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email + Password ──────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.isActive)    return null;
        if (!user.hashedPassword)       return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) return null;

        return {
          id:             user.id,
          name:           user.name    ?? "",
          email:          user.email   ?? "",
          image:          user.avatarUrl   ?? "",
          role:           user.role,
          organizationId: user.organizationId ?? "",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      // First sign in — user object is available
      if (user) {
        token.id             = user.id;
        token.role           = user.role;
        token.organizationId = user.organizationId;
      }

      // Google sign in — save/update user in database
      if (account?.provider === "google" && profile) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            // Create new user + organization
            const slug =
              profile.email.split("@")[0]
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-") +
              "-" + Date.now();

            const org = await prisma.organization.create({
              data: {
                name: `${profile.name}'s Organization`,
                slug,
              },
            });

            dbUser = await prisma.user.create({
              data: {
                name:           profile.name,
                email:          profile.email,
                image:          profile.picture ?? null,
                role:           "OWNER",
                isActive:       true,
                organizationId: org.id,
              },
            });
          } else if (!dbUser.organizationId) {
            // Existing user without org — create one
            const slug =
              profile.email.split("@")[0]
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-") +
              "-" + Date.now();

            const org = await prisma.organization.create({
              data: {
                name: `${profile.name}'s Organization`,
                slug,
              },
            });

            dbUser = await prisma.user.update({
              where: { email: profile.email },
              data: {
                organizationId: org.id,
                role:           "OWNER",
                isActive:       true,
                avatarUrl:      profile.picture ?? dbUser.avatarUrl,
              },
            });
          }

          token.id             = dbUser.id;
          token.role           = dbUser.role;
          token.organizationId = dbUser.organizationId;
        } catch (err) {
          console.error("[jwt google callback error]", err);
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id             = token.id;
        session.user.role           = token.role           ?? "VIEWER";
        session.user.organizationId = token.organizationId ?? "";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
