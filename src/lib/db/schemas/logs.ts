import { json, pgEnum, pgTable, serial, text, time } from "drizzle-orm/pg-core";

export const logType = pgEnum("log_type", ["info", "error"]);

export const logs = pgTable("logs", {
	id: serial("id").primaryKey(),
	message: text("message").notNull(),
    data: json("data"),
    logType: logType("log_type").default("info"),
	createdAt: time("created_at").defaultNow(),
});
