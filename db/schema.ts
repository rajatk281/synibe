
import { integer, text, boolean, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  destName: text("Destination").notNull(),
  accessHash: text("Access Hash").notNull(),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("private"),
  participantLimit: integer("Participant Limit").notNull().default(10),
  creatorId: text("Creator ID").notNull(),
  videoUrl: text("Video URL").notNull().default(""),
});
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  welcomeEmailSent: boolean("welcome_email_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

