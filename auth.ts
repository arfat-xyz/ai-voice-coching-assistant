import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      try {
        const userAlreadyExist = await db.user.count({
          where: { email: user.email },
        });

        if (!userAlreadyExist) {
          await db.user.create({
            data: {
              email: user.email,
              name: user.name ?? undefined, // Handle null/undefined
              image: user.image ?? undefined,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.name && session.user) {
        session.user.name = token.name;
      }
      if (token.email && session.user) {
        session.user.email = token.email;
      }
      if (token.picture && session.user) {
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email ?? undefined },
        });

        if (dbUser) {
          return {
            ...token,
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
          };
        }

        if (user.id) {
          token.id = user.id;
        }
      }

      // For subsequent calls
      if (!token.email) return token;

      const dbUser = await db.user.findUnique({
        where: { email: token.email },
      });

      if (!dbUser) return token;

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
});
