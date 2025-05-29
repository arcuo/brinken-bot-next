import { sendMessageToChannel } from "@/lib/discord/client";
import { DateTime } from "luxon";
import * as cron from "cron";

const wednesdayCron = new cron.CronTime("0 0 * * wed");
export async function handleHouseMeeting(generalChannelId: string) {
	// Check if this is the last wednesday of the month

	const lastWednesday = getLastWednesdayOfMonth(DateTime.fromISO("2025-05-26"));
	if (!lastWednesday.success) {
		return;
	}

	if (lastWednesday.date.diffNow("days").days > 7) {
		return;
	}

	// Set the time of the last wednesday to current time
	const now = DateTime.now();

	if (now.weekdayLong === "Sunday") {
		sendMessageToChannel(generalChannelId, {
			content: `
# House Meeting :house_with_garden:
Remember that this coming Wednesday that we will have a house meeting!
			`,
		});
	}

	if (now.weekdayLong === "Wednesday") {
		sendMessageToChannel(generalChannelId, {
			content: `
# House Meeting :house_with_garden:
Remember that this is the last Wednesday of the month and the house meeting is tonight at 18:00!
			`,
		});
	}
}

export function getLastWednesdayOfMonth(date?: DateTime):
	| {
			success: false;
			error: string;
	  }
	| {
			success: true;
			date: DateTime;
	  } {
	const from = date ?? DateTime.now();

	const currentMonth = from.month;
	let nextWednesday = wednesdayCron.getNextDateFrom(from);

	if (nextWednesday.month !== currentMonth) {
		// Check if today is the last wednesday of the month
		if (from.weekdayLong === "Wednesday") {
			return { success: true, date: from };
		}
		return { success: false, error: "No more Wednesdays in the month" };
	}

	let result = wednesdayCron.getNextDateFrom(nextWednesday);
	while (result.month === currentMonth) {
		nextWednesday = result;
		result = wednesdayCron.getNextDateFrom(result);
	}

	return { success: true, date: nextWednesday };
}
