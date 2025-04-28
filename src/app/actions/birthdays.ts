"use server";
import {
	getAllUsers,
	getBirthdayUsersAndResponsible,
} from "@/app/actions/users";
import { db } from "@/lib/db";
import { channels } from "@/lib/db/schemas/channels";
import {
	createBirthdayChannel,
	sendMessageToChannel,
	deleteChannels,
} from "@/lib/discord/client";
import { inArray } from "drizzle-orm";
import { DateTime } from "luxon";

/** Checks if any birthdays are in a week before the current date.
 *
 * - Create new birthday channel
 * - Send message to the channel
 */
export async function handleWeekBeforeBirthday() {
	// Check if someones birthday is in a week before the current date
	const inAWeek = DateTime.now().plus({ weeks: 1 });

	const { users: usersWithBirthday, responsible } =
		await getBirthdayUsersAndResponsible(inAWeek);

	if (usersWithBirthday && usersWithBirthday.length > 0) {
		// Create new birthday channel
		createBirthdayChannel(usersWithBirthday, [responsible], inAWeek);
		// Send message to the channel
	}
}

export async function handleDayBirthdayTomorrow() {
	const tomorrow = DateTime.now().plus({ days: 1 });
	const bdchannels = (await db.select().from(channels)).filter(
		(ch) =>
			DateTime.fromJSDate(ch.birthdayDate).toFormat("MM-dd") ===
			tomorrow.toFormat("MM-dd"),
	);

	await Promise.all(
		bdchannels.map((ch) =>
			sendMessageToChannel(ch.discordChannelId, {
				content: `
Remember to send your birthday wishes to <@${ch.birthdayRecipientDiscordId}> on ${DateTime.fromJSDate(ch.birthdayDate).toFormat("dd/MM/yyyy")}.
        `,
			}),
		),
	);
}

export async function handleBirthdayToday(birthdayChannelId: string) {
	const users = await getAllUsers();
	const birthdays = users.filter(
		(u) => DateTime.fromJSDate(u.birthday).diffNow("days").days === 0,
	);
	if (!birthdays.length) return;

	await sendMessageToChannel(birthdayChannelId, {
		content: `
# Birthdays! :flag_dk: :tada:

Happy birthday to ${birthdays.map((u) => `<@${u.discordId}>`).join(", ")}!

Remember to send your birthday wishes!.
        `,
	});
}

/** Clean up birthday channels a week after the birthday */
export async function handleCleanUpBirthdayChannels() {
	const aWeekAgo = DateTime.now().minus({ weeks: 1 });
	const birthdayChannels = (await db.select().from(channels)).filter(
		(ch) => DateTime.fromJSDate(ch.birthdayDate) < aWeekAgo,
	);

	if (!birthdayChannels.length) return;
	await deleteChannels(...birthdayChannels.map((ch) => ch.discordChannelId));

	// Delete channels from database
	await db.delete(channels).where(
		inArray(
			channels.discordChannelId,
			birthdayChannels.map((ch) => ch.discordChannelId),
		),
	);
}
