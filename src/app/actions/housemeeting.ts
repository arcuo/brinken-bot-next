import { sendMessageToChannel } from "@/lib/discord/client";
import { DateTime } from "luxon";

export async function handleHouseMeeting(generalChannelId: string) {
	// Check if this is the last wednesday of the month

	const lastWednesday = getLastWednesdayOfMonth();
	if (!lastWednesday.success) {
		return;
	}

	if (lastWednesday.date.diffNow("days").days <= 2) {
		sendMessageToChannel(generalChannelId, {
			content: `
# House Meeting
Remember that this Wednesday is the last Wednesday of the month and that we will have a house meeting!
			`,
		});
	}

	if (lastWednesday.date.day === DateTime.now().day) {
		sendMessageToChannel(generalChannelId, {
			content: `
# House Meeting
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
	// Get the last wednesday of the month
	const today = date ?? DateTime.now();

	// Get last day of the month
	let current = DateTime.fromObject({
		year: today.year,
		month: today.month,
		day: today.daysInMonth,
	});

	let timeout = 0;
	while (current.weekdayLong !== "Wednesday") {
		timeout++;
		if (timeout >= 8) {
			return { success: false, error: "Something went wrong" };
		}
		current = current.minus({ day: 1 });
		if (current.day < today.day) {
			return { success: false, error: "No more Wednesdays in the month" };
		}
	}

	return { success: true, date: current };
}
