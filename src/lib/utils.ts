import { clsx, type ClassValue } from "clsx";
export { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import type { doodles } from "./db/schemas/doodles";

// Set date to UTC+2 timezone
DateTime.local().setZone("UTC+2");

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Sort dates by birthday, ignoring the year. */
export function sortBirthdays(a: Date, b: Date) {
	const aBirthday = DateTime.fromJSDate(a).toFormat("MM-dd");
	const bBirthday = DateTime.fromJSDate(b).toFormat("MM-dd");
	return aBirthday.localeCompare(bBirthday);
}

type HumanizedTimeDiff =
	| "Today"
	| "Tomorrow"
	| "Already passed"
	| `${number} days left`
	| `${number} weeks left`;

/** Translate how time is left until the given date. Returns "Already passed" if the date is in the past. */
export function humanizeDateDiffFuture(
	date: DateTime,
	now: DateTime<boolean> | undefined = DateTime.now(),
): HumanizedTimeDiff {
	const normalizedDate = date.set({
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0,
	});
	const normalizedNow = now.set({
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0,
	});

	const diffDays = normalizedDate.diff(normalizedNow, "days").days;

	if (diffDays < 0) {
		return "Already passed";
	}

	if (diffDays === 0) {
		return "Today";
	}

	if (diffDays === 1) {
		return "Tomorrow";
	}

	if (diffDays < 7) {
		return `${Math.ceil(diffDays)} days left`;
	}

	return normalizedDate
		.diff(normalizedNow, "weeks")
		.toFormat("w 'weeks' 'left'") as `${number} weeks left`;
}

/**
 * Creates a message for the doodle channel
 * @param message Extra message to prepend to the doodle message.
 * @param doodle The doodle to create the message for.
 * @param deadline Whether to include the deadline in the message.
 * @returns String containing the message.
 */
export function createDoodleChannelMessage(
	message: string,
	doodle: typeof doodles.$inferSelect,
	deadline = true,
) {
	const messageToSend = `
## :robot: :calendar_spiral: Doodle: ${doodle.title}
${message}

Please take a look and fill out the doodle here if you haven't already :raised_hands: : ${doodle.link}
${
	doodle.description
		? `### Description
${doodle.description}`
		: ""
}
`;

	if (deadline) {
		const deadlineDateTime = DateTime.fromJSDate(doodle.deadline);
		return `${messageToSend}
### Deadline
The deadline for this doodle is **${deadlineDateTime.toFormat("dd LLL yyyy")}** (in ${Math.round(
			deadlineDateTime.diffNow("days").days,
		)} days).
				`;
	}

	return messageToSend;
}
