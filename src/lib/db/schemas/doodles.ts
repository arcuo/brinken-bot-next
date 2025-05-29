import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const doodles = pgTable("doodles", {
	id: serial("id").primaryKey(),
	deadline: timestamp("deadline", {
		mode: "date",
		withTimezone: true,
	}).notNull(),
	link: text("link").notNull(),
	level: text("level", { enum: ["light", "medium", "heavy"] }).default("light"),
	title: text("title").notNull(),
	description: text("description"),
	lastMessage: timestamp("lastMessage", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type DoodleInsert = typeof doodles.$inferInsert;
export type Doodle = typeof doodles.$inferSelect;
