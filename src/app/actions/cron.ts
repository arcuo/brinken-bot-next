"use server";

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
	console.log("Handling birthdays");
	try {
		await handleCleanUpBirthdayChannels();
		await handleWeekBeforeBirthday();
		await handleDayBirthdayTomorrow();
	} catch (error) {
		if (error instanceof Error)
			console.log(`Something when wrong with the birthdays: ${error.message}`);
	}

	console.log("Handle dinners");
	try {
		await handleMondayBeforeDinner();
		await handleDayOfDinner();
	} catch (error) {
		if (error instanceof Error)
			console.log(`Something when wrong with the birthdays: ${error.message}`);
	}

	console.log("Handle house meeting");
	try {
		await handleHouseMeeting();
	} catch (error) {
		if (error instanceof Error)
			console.log(
				`Something when wrong with the house meeting: ${error.message}`,
			);
	}
}
