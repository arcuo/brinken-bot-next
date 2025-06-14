import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { DateTime } from "luxon";

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

export const shouldSendMessageByLevel = (
	doodle: Doodle,
	now: DateTime<boolean> = DateTime.now(),
): boolean => {
	const lastMessage = DateTime.fromJSDate(doodle.lastMessage);

	switch (doodle.level) {
		case "light":
			// Check if the message was sent more than a week ago
			if (Math.abs(lastMessage.diff(now, "days").days) >= 7) {
				return true;
			}
			break;
		case "medium":
			if (Math.abs(lastMessage.diff(now, "days").days) >= 3) {
				return true;
			}
			break;
		case "heavy":
			if (Math.abs(lastMessage.diff(now, "days").days) >= 1) {
				return true;
			}
			break;
	}
	return false;
};

export type DoodleInsert = typeof doodles.$inferInsert;
export type Doodle = typeof doodles.$inferSelect;
