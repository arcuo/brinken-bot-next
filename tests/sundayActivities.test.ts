import { describe, expect, it } from "bun:test";
import { shuffleArray } from "../scripts/seedSundayActivities";

describe("shuffleArray", () => {
	it("should shuffle an array randomly", () => {
		const array = [1, 2, 3, 4, 5];
		const shuffledArray = shuffleArray(array);
		expect(shuffledArray).not.toEqual(array);
		expect(shuffledArray.length).toEqual(array.length);
		expect(shuffledArray).toEqual(expect.arrayContaining(array));
	});
});
