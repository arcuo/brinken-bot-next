import { date, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sundayActivities = pgTable("sunday_activities", {
	id: serial("id").primaryKey(),
	discordId: varchar("discord_id", { length: 50 })
		.references(() => users.discordId, { onDelete: "cascade" })
		.notNull(),
	date: date("date", { mode: "date" }).notNull(),
	description: text("description"),
});