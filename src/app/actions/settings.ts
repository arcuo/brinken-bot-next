"use server";

import { env } from "@/env";
import { db } from "@/lib/db";
import {
	settings,
	type SettingId,
	type SettingValue,
} from "@/lib/db/schemas/settings";
import { log } from "@/lib/log";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const getAllSettings = unstable_cache(
	async () => {
		// Fetch settings from the database
		const allSettings = await db.select().from(settings);

		const result: Record<SettingId, SettingValue | null> = {
			dinner_channel_id:
				allSettings.find((s) => s.settingId === "dinner_channel_id")?.value ??
				(env.DINNER_CHANNEL_ID
					? {
							discordChannelId: env.DINNER_CHANNEL_ID,
							channelName: "Set with env",
						}
					: null),
			birthday_channel_id:
				allSettings.find((s) => s.settingId === "birthday_channel_id")?.value ??
				(env.BIRTHDAY_CHANNEL_ID
					? {
							discordChannelId: env.BIRTHDAY_CHANNEL_ID,
							channelName: "Set with env",
						}
					: null),
			general_channel_id:
				allSettings.find((s) => s.settingId === "general_channel_id")?.value ??
				(env.GENERAL_CHANNEL_ID
					? {
							discordChannelId: env.GENERAL_CHANNEL_ID,
							channelName: "Set with env",
						}
					: null),
		};
		return result;
	},
	["settings"],
	{ revalidate: 60 * 60 * 1000 },
); // Cache for 1 hour

export async function setSetting(settingId: SettingId, value: SettingValue) {
	const res = await db
		.insert(settings)
		.values({ settingId, value })
		.onConflictDoUpdate({
			target: settings.settingId,
			set: { value },
		});
	revalidateTag("settings");
	revalidatePath("/");

	log("Setting updated", { data: { settingId, value } });
}
