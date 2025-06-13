// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@lib/prisma";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.runnerProfile.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) return null;
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && (token as JWT & { avatarUrl?: string }).avatarUrl) {
        const avatar = (
          token as JWT & { avatarUrl?: string }
        ).avatarUrl as string;
        session.user.avatarUrl = avatar;
      }
      return session;
    },
    async jwt({
        token,
        user,
        trigger,
        session,
      }: {
        token: JWT;
        user?: User;
        trigger?: string;
        session?: Session;
      }) {  
      
      if (user) {
        token.id = user.id;
        (token as JWT & { avatarUrl?: string }).avatarUrl = (
          user as User & { avatarUrl?: string }
        ).avatarUrl;
      }
      if (trigger === "update" && session?.user?.avatarUrl !== undefined) {
        (token as JWT & { avatarUrl?: string }).avatarUrl = session.user
          .avatarUrl as string | undefined;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
