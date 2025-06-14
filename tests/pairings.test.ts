import { describe, expect, test } from "bun:test";

import {
	generateAllPairings, getNextNWednesdaysFromDate
} from "@/lib/pairings";

describe("Pairings", () => {
	// biome-ignore lint/complexity/noForEach: <explanation>
	Array.from({ length: 9 }, (_, i) => i + 2).forEach((i) =>
		test(`generateAllPairings generates valid pairings for ${i} individuals`, () => {
			const n = i;
			const pairings = generateAllPairings(n);

			// Ensure the total number of pairings is correct
			expect(pairings.length).toBeGreaterThanOrEqual(n);

			// Ensure each individual appears as the first and second member 4 or 5 times
			const firstCounts: Record<number, number> = {};
			const secondCounts: Record<number, number> = {};

			for (let i = 0; i <= n - 1; i++) {
				firstCounts[i] = 0;
				secondCounts[i] = 0;
			}

			for (const [first, second] of pairings) {
				firstCounts[first]++;
				secondCounts[second]++;
			}

			const firstCountValues = Object.values(firstCounts);
			const secondCountValues = Object.values(secondCounts);

			for (let i = 0; i <= n - 1; i++) {
				// Check that each individual only has at most one more pairing than the others
				const currentFirstCount = firstCounts[i];
				const currentSecondCount = secondCounts[i];
				const res = Math.max(
					...firstCountValues.map((count) =>
						Math.abs(count - currentFirstCount),
					),
				);
				expect(res).toBeLessThanOrEqual(1);
				expect(
					Math.max(
						...secondCountValues.map((count) =>
							Math.abs(count - currentSecondCount),
						),
					),
				).toBeLessThanOrEqual(1);
			}

			// Ensure all pairings are unique
			const uniquePairings = new Set(pairings.map(([a, b]) => `${a}-${b}`));
			expect(uniquePairings.size).toBe(pairings.length);
		}),
	);
});

describe("getNextNWednesdaysFromDate", () => {
	test("returns the next N Wednesdays from a given date", () => {
		const startDate = new Date("2025-04-14"); // Monday
		const nextWednesdays = getNextNWednesdaysFromDate(3, startDate);
		const expectedDates = [
			new Date("2025-04-23"), // Second Wednesday
			new Date("2025-04-30"), // Third Wednesday
			new Date("2025-05-07"), // Fourth Wednesday
		];

		expect(nextWednesdays.map((date) => date.toDateString())).toEqual(
			expectedDates.map((date) => date.toDateString()),
		);
	});

	test("Does not return the same Wednesday given", () => {
		const startDate = new Date("2025-04-16"); // Wednesday
		const nextWednesdays = getNextNWednesdaysFromDate(2, startDate);
		const expectedDates = [
			new Date("2025-04-23"), // Second Wednesday
			new Date("2025-04-30"), // Third Wednesday
		];

		expect(nextWednesdays.map((date) => date.toDateString())).toEqual(
			expectedDates.map((date) => date.toDateString()),
		);
	});
});
