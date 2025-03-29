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
      account: (tokens) => {
        console.log({ tokens });
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ profile }) {
  //     if (!profile?.email) return false;
  //     const checkExist = await db.user?.count({
  //       where: {
  //         email: profile?.email,
  //       },
  //     });
  //     if(!count){
  //       await db.user.create({})
  //     }
  //     return true;
  //   },
  // },
  session: {
    strategy: "jwt",
  },
});
