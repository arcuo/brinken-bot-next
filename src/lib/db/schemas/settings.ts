import * as pg from "drizzle-orm/pg-core";
import { z } from "zod";

export const settingEnum = pg.pgEnum("setting_enum", [
	"birthday_channel_id",
	"dinner_channel_id",
	"general_channel_id",
]);

export type SettingId = (typeof settingEnum.enumValues)[number];

export function getSettingName(settingId: SettingId) {
	switch (settingId) {
		case "birthday_channel_id":
			return "Birthday channel";
		case "dinner_channel_id":
			return "Dinner channel";
		case "general_channel_id":
			return "General channel";
	}
}

export function getSettingDescription(settingId: SettingId) {
	switch (settingId) {
		case "birthday_channel_id":
			return "Channel where general birthday messages are posted";
		case "dinner_channel_id":
			return "Channel where dinner dates are posted and where the polls are created";
		case "general_channel_id":
			return "Channel where general messages are posted";
	}
}

const valueType = (name: string) =>
	pg.customType<{ data: SettingValue; driverData: string }>({
		dataType() {
			return "jsonb";
		},
		toDriver(value: SettingValue): string {
			return JSON.stringify(value);
		},
		fromDriver(value: unknown): SettingValue {
			return valueSchema.parse(value);
		},
	})(name);

const valueSchema = z.object({
	discordChannelId: z.string().min(1),
	channelName: z.string().min(1),
});

export type SettingValue = z.infer<typeof valueSchema>;

export const settings = pg.pgTable("settings", {
	id: pg.serial("id").primaryKey(),
	settingId: settingEnum("setting_id").notNull().unique(),
	value: valueType("value").notNull(),
});
