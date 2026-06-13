import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "./db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "./lib/Email";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/signin" },

  callbacks: {
  async signIn({ user }) {

    if (!user.email) return false;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser) {

      await db.insert(users).values({
        name: user.name || "User",
        email: user.email,
        image: user.image || null,
      });

      sendWelcomeEmail(user.email, user.name || "User")
    }

    return true;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub!;
    }

    return session;
  },
},
})