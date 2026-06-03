import { integer, text, boolean, pgTable, uuid } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  destName: text("Destination").notNull(),
  accessHash: text("Access Hash").notNull(),
  visibility: text("visibility", {enum: ["public", "private"]}).notNull().default("private"),
  participantLimit: integer("Participant Limit").notNull().default(10),
  creatorId: text("Creator ID").notNull()

 
});
