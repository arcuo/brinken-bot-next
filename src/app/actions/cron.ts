"use server";

import { log, error } from "@/lib/log";
import {
	handleWeekBeforeBirthday,
	handleCleanUpBirthdayChannels,
	handleDayBirthdayTomorrow,
	handleBirthdayToday,
} from "./birthdays";
import { handleDayOfDinner, handleMondayBeforeDinner } from "./dinners";
import { handleHouseMeeting } from "./housemeeting";
import { getAllSettings } from "./settings";
import { env } from "@/env";

/**
 *
 * Cron job for handling all the actions of the day
 *
 * - Handle birthdays
 *   - Clean up birthday channels
 *   - Send message to birthday channel if birthday is in a week
 *   - Send message to birthday channel if birthday is tomorrow
 * - Handle dinners
 *   - Send message monday before dinner and make poll
 *   - Send message to dinner channel if dinner is today
 * - Handle house meeting
 *   - Send message if house meeting is on wednesday
 *   - Send message if house meeting is today
 */
export async function handleDay() {
	const settings = await getAllSettings();
	await log("Handling day");
	try {
		await handleCleanUpBirthdayChannels();
		await handleWeekBeforeBirthday();
		await handleDayBirthdayTomorrow();
		const birthdayChannelId =
			settings.birthday_channel_id?.discordChannelId ?? env.BIRTHDAY_CHANNEL_ID;
		if (!birthdayChannelId) {
			throw Error(
				"No birthday channel id found. Please set it in the settings.",
			);
		}
		await handleBirthdayToday(birthdayChannelId);
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the birthdays: ${err.message}`,
			);
	}

	try {
		const dinnerChannelId =
			settings.dinner_channel_id?.discordChannelId ?? env.DINNER_CHANNEL_ID;
		if (!dinnerChannelId) {
			throw Error("No dinner channel id found. Please set it in the settings.");
		}
		await handleMondayBeforeDinner(dinnerChannelId);
		await handleDayOfDinner(dinnerChannelId);
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the birthdays: ${err.message}`,
			);
	}

	try {
		const generalChannelId =
			settings.general_channel_id?.discordChannelId ?? env.GENERAL_CHANNEL_ID;
		if (!generalChannelId) {
			throw Error(
				"No general channel id found. Please set it in the settings.",
			);
		}
		await handleHouseMeeting(generalChannelId);
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the house meeting: ${err.message}`,
			);
	}
}
