import bcrypt from "bcrypt";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/libs/prismadb";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;

      role: "TENTOR" | "ADMIN" | "SUPER";

      image: string | null;
      // ...other properties
      // role: UserRole;
    };
    // & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: "TENTOR" | "ADMIN" | "SUPER";
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error("No user found");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.user = {
        // @ts-ignore
        id: token.id,
        // @ts-ignore
        role: token.role,
        // @ts-ignore
        image: token.image,
        // @ts-ignore
        name: token.name,
      };
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
