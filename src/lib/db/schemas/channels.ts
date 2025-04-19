import { date, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const channels = pgTable("channels", {
	id: serial("id").primaryKey(),
	discordChannelId: text("discord_channel_id").notNull(),
	birthdayRecipientDiscordId: varchar("birthday_recipient_discord_id", {
		length: 50,
	}).references(() => users.discordId),
	birthdayDate: date("birthday_date", { mode: "date" }).notNull(),
});
