"use server";

import { log, error } from "@/lib/log";
import {
	handleWeekBeforeBirthday,
	handleCleanUpBirthdayChannels,
	handleDayBirthdayTomorrow,
	handleBirthdayToday,
} from "./birthdays";
import { handleDinnerMessage } from "./dinners";
import { handleHouseMeeting } from "./housemeeting";
import { getAllSettings } from "./settings";
import { env } from "@/env";
import { handleDoodles } from "./doodles";

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
export async function handleDay(
	opts = {
		birthdays: true,
		dinners: true,
		houseMeeting: true,
		doodles: true,
	},
) {
	const settings = await getAllSettings();
	await log(
		`Handling day: Birthdays ${opts.birthdays ? "✅" : "❌"}, Dinners ${opts.dinners ? "✅" : "❌"}, House Meeting ${opts.houseMeeting ? "✅" : "❌"} Doodles ${opts.doodles ? "✅" : "❌"}`,
	);
	if (opts.birthdays) {
		try {
			await handleCleanUpBirthdayChannels();
			await handleWeekBeforeBirthday();
			await handleDayBirthdayTomorrow();
			const birthdayChannelId =
				settings.birthday_channel_id?.discordChannelId ??
				env.BIRTHDAY_CHANNEL_ID;
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
	}

	if (opts.dinners) {
		try {
			const dinnerChannelId =
				settings.dinner_channel_id?.discordChannelId ?? env.DINNER_CHANNEL_ID;
			if (!dinnerChannelId) {
				throw Error(
					"No dinner channel id found. Please set it in the settings.",
				);
			}
			await handleDinnerMessage({
				dinnerChannelId,
				day: "Sunday",
				message:
					"@everyone We are having our regular dinner date on Wednesday! It will be awesome to see you all there! :tada:",
				sendPoll: true,
			});
			await handleDinnerMessage({
				dinnerChannelId,
				day: "Tuesday",
				message:
					"@everyone tomorrow we have our regular Wednesday dinner date. Remember to vote if you're attending! :writing_hand:",
				sendPoll: false,
			});
			await handleDinnerMessage({
				dinnerChannelId,
				day: "Wednesday",
				message:
					"@everyone today is dinner day. Remember to vote if you're attending! Poll closes at 13:00!",
				sendPoll: false,
			});
		} catch (err) {
			if (err instanceof Error)
				await error(
					`Handle Day: Something when wrong with the dinners: ${err.message}`,
				);
		}
	}

	if (opts.houseMeeting) {
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

	if (opts.doodles) {
		try {
			const doodleChannelId =
				settings.doodle_channel_id?.discordChannelId ?? env.DOODLE_CHANNEL_ID;
			if (!doodleChannelId) {
				throw Error(
					"No doodle channel id found. Please set it in the settings.",
				);
			}
			await handleDoodles(doodleChannelId);
		} catch (err) {
			if (err instanceof Error)
				await error(
					`Handle Day: Something when wrong with the doodles: ${err.message}`,
				);
		}
	}
}
