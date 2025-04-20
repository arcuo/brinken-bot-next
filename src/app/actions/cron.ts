"use server";

import { log, error } from "@/lib/log";
import {
	handleWeekBeforeBirthday,
	handleCleanUpBirthdayChannels,
	handleDayBirthdayTomorrow,
} from "./birthdays";
import { handleDayOfDinner, handleMondayBeforeDinner } from "./dinners";
import { handleHouseMeeting } from "./housemeeting";

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
	await log("Handling day");
	try {
		await handleCleanUpBirthdayChannels();
		await handleWeekBeforeBirthday();
		await handleDayBirthdayTomorrow();
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the birthdays: ${err.message}`,
			);
	}

	try {
		await handleMondayBeforeDinner();
		await handleDayOfDinner();
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the birthdays: ${err.message}`,
			);
	}

	try {
		await handleHouseMeeting();
	} catch (err) {
		if (err instanceof Error)
			await error(
				`Handle Day: Something when wrong with the house meeting: ${err.message}`,
			);
	}
}
