import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const doodles = pgTable("doodles", {
	id: serial("id").primaryKey(),
	deadline: date("deadline", { mode: "date" }).notNull(),
	link: text("link").notNull(),
	level: text("level", { enum: ["light", "medium", "heavy"] }).default("light"),
	description: text("message"),
});

export type DoodleInsert = typeof doodles.$inferInsert;
