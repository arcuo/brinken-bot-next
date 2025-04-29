import { DateTime } from "luxon";
import { humanizeDateDiffFuture, sortBirthdays } from "../src/lib/utils";
import { describe, expect, it } from "bun:test";

describe("humanizeDateDiffFuture", () => {
	const baseDate = DateTime.fromObject({ year: 2023, month: 1, day: 25 });
	it("should return 'Today' for the current date", () => {
		const today = DateTime.fromObject({ year: 2023, month: 1, day: 25 });
		expect(humanizeDateDiffFuture(today, baseDate)).toBe("Today");
	});

	it("should return 'Tomorrow' for the next day", () => {
		const tomorrow = DateTime.fromObject({ year: 2023, month: 1, day: 26 });
		expect(humanizeDateDiffFuture(tomorrow, baseDate)).toBe("Tomorrow");
	});

	it("should return 'X days left' for dates within the next week", () => {
		const inThreeDays = DateTime.fromObject({ year: 2023, month: 1, day: 28 });
		expect(humanizeDateDiffFuture(inThreeDays, baseDate)).toBe("3 days left");
	});

	it("should return 'X weeks left' for dates beyond a week", () => {
		const inTwoWeeks = DateTime.fromObject({ year: 2023, month: 2, day: 9 });
		expect(humanizeDateDiffFuture(inTwoWeeks, baseDate)).toBe("2 weeks left");
	});

	it("should handle negative days gracefully", () => {
		const yesterday = DateTime.fromObject({ year: 2023, month: 1, day: 24 });
		expect(humanizeDateDiffFuture(yesterday, baseDate)).toBe("Already passed");
	});

	it("should handle year and month change gracefully", () => {
		expect(
			humanizeDateDiffFuture(
				DateTime.fromObject({ year: 2025, month: 1, day: 1 }),
				DateTime.fromObject({ year: 2024, month: 12, day: 31 }),
			),
		).toBe("Tomorrow");

		expect(
			humanizeDateDiffFuture(
				DateTime.fromObject({ year: 2025, month: 1, day: 2 }),
				DateTime.fromObject({ year: 2024, month: 12, day: 31 }),
			),
		).toBe("2 days left");

		expect(
			humanizeDateDiffFuture(
				DateTime.fromObject({ year: 2025, month: 1, day: 14 }),
				DateTime.fromObject({ year: 2024, month: 12, day: 31 }),
			),
		).toBe("2 weeks left");
	});
});

describe("sortBirthdays", () => {
	it("should sort dates correctly with the same, year and month", () => {
		const a = DateTime.fromObject({ year: 2023, month: 1, day: 25 }).toJSDate();
		const b = DateTime.fromObject({ year: 2023, month: 1, day: 26 }).toJSDate();
		expect(sortBirthdays(a, a)).toBe(0);
		expect(sortBirthdays(a, b)).toBeLessThan(0);
		expect(sortBirthdays(b, a)).toBeGreaterThan(0);
	});
	it("should sort dates correctly with different years", () => {
		const a = DateTime.fromObject({ year: 2024, month: 1, day: 25 }).toJSDate();
		const b = DateTime.fromObject({ year: 2021, month: 1, day: 26 }).toJSDate();
		expect(sortBirthdays(a, a)).toBe(0);
		expect(sortBirthdays(a, b)).toBeLessThan(0);
		expect(sortBirthdays(b, a)).toBeGreaterThan(0);
	});
});
