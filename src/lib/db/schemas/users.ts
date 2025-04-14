import { date, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	discordId: varchar("discordId", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	nickname: varchar("nickname", { length: 255 }),
	birthday: date("birthday").notNull(),
	phone: varchar("phone", { length: 8 }),
});

export type User = typeof users.$inferSelect;
