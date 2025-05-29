import { clsx, type ClassValue } from "clsx";
export { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

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
