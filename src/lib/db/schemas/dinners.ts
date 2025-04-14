import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "./users";

export const dinners = pgTable("dinner", {
	id: serial("id").primaryKey(),
	date: date("date", { mode: "date" }).unique().notNull(),
	headchefId: integer("headchefId")
		.references(() => users.id)
		.notNull(),
	souschefId: integer("souschefId")
		.references(() => users.id)
		.notNull(),
});
