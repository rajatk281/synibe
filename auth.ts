import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "./db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "./lib/Email";
import { redis } from "./lib/redis";

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

    // ── Check Redis cache first ──
    const cacheKey = `user:email:${user.email}`;
    let existingUser: typeof users.$inferSelect | null = null;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        existingUser = JSON.parse(cached);
      }
    } catch {
      // Redis unavailable — fall through to DB
    }

    if (!existingUser) {
      existingUser = (await db.query.users.findFirst({
        where: eq(users.email, user.email!),
      })) ?? null;

      // Cache the result if found
      if (existingUser) {
        try {
          await redis.set(cacheKey, JSON.stringify(existingUser), { EX: 600 });
        } catch {
          // Redis unavailable — no-op
        }
      }
    }

    if (!existingUser) {

      await db.insert(users).values({
        name: user.name || "User",
        email: user.email,
        image: user.image || null,
      });

      // Cache the new user
      try {
        const newUserData = {
          name: user.name || "User",
          email: user.email,
          image: user.image || null,
          role: "user",
          welcomeEmailSent: false,
        };
        await redis.set(cacheKey, JSON.stringify(newUserData), { EX: 600 });
      } catch {
        // Redis unavailable — no-op
      }

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