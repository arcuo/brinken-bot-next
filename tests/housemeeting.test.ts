import { describe, expect, test } from "bun:test";

import { getLastWednesdayOfMonth } from "../src/app/actions/housemeeting";
import { DateTime } from "luxon";

describe("getLastWednesdayOfMonth", () => {
	test("returns the last Wednesday of january", () => {
        const first = DateTime.fromObject({ year: 2025, month: 1, day: 1 });
        const second = DateTime.fromObject({ year: 2025, month: 1, day: 2 });
        const twentyEighth = DateTime.fromObject({ year: 2025, month: 1, day: 28 });

		const lastWednesday = getLastWednesdayOfMonth(first);
        if (!lastWednesday.success) {
            throw new Error(lastWednesday.error);
        }
        expect(lastWednesday.date.equals(DateTime.fromISO("2025-01-29"))).toBe(true);

        const lastWednesday2 = getLastWednesdayOfMonth(second);
        if (!lastWednesday2.success) {
            throw new Error(lastWednesday2.error);
        }
        expect(lastWednesday2.date.equals(DateTime.fromISO("2025-01-29"))).toBe(true);

        const lastWednesday3 = getLastWednesdayOfMonth(twentyEighth);
        if (!lastWednesday3.success) {
            throw new Error(lastWednesday3.error);
        }
        expect(lastWednesday3.date.equals(DateTime.fromISO("2025-01-29"))).toBe(true);
	});

    test("should fail if there are no wednesdays left in the month", () => {
        const date = DateTime.fromObject({ year: 2025, month: 2, day: 27 }); // Last wednesday of february is 26th
        const lastWednesday = getLastWednesdayOfMonth(date);
        expect(lastWednesday.success).toBe(false);
        expect(!lastWednesday.success && lastWednesday.error).toBe("No more Wednesdays in the month");
    });

    test("should return same date if it is last wednesday of the month", () => {
        const date1 = DateTime.fromObject({ year: 2025, month: 1, day: 29 }); // Last wednesday of january is 29th
        const date2 = DateTime.fromObject({ year: 2025, month: 2, day: 26 }); // Last wednesday of february is 26th
        const lastWednesday = getLastWednesdayOfMonth(date1);
        expect(lastWednesday.success).toBe(true);
        expect(lastWednesday.success && lastWednesday.date.equals(DateTime.fromISO("2025-01-29"))).toBe(true);

        const lastWednesday2 = getLastWednesdayOfMonth(date2);
        expect(lastWednesday2.success).toBe(true);
        expect(lastWednesday2.success && lastWednesday2.date.equals(DateTime.fromISO("2025-02-26"))).toBe(true);
    });

});