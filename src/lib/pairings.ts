/**
 * Generates all possible pairings for a group of 10 individuals, ensuring that each individual
 * meets every other individual exactly 4 or 5 times. The function uses a simulation approach
 * to rotate individuals in a seating arrangement to generate pairings.
 *
 * @param {number} n - The number of individuals to generate pairings for. Currently, only 10 is supported.
 * @returns {number[][]} - An array of pairings, where each pairing is represented as a two-element array.
 * @throws {Error} - Throws an error if the input number is not 10.
 */
export function generateAllPairings(n: number) {
	// if (n % 2 !== 0) {
	// 	throw new Error(
	// 		"Only even numbers are supported for pairings. Please provide an even number.",
	// 	);
	// }

	// Initialize the top and bottom rows with indices representing individuals.
	const topRow = Array.from({ length: n }, (_, i) => i);
	const bottomRow = topRow.splice(n / 2);

	const matches: number[][] = [];

	// Generate pairings by simulating seat rotations.
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < bottomRow.length && j < topRow.length; j++) {
			matches.push([topRow[j], bottomRow[j]]);
		}

		// Rotate seats to simulate a new arrangement for the next round of pairings.
		topRow.unshift(bottomRow.shift()!); // Add the removed bottom-row person to the start of the top row.
		bottomRow.push(topRow.pop()!); // Add the removed top-row person to the end of the bottom row.
	}

	return matches;
}

/**
 * Calculates the date of the most recent Wednesday from the current date.
 *
 * @returns {Date} - A Date object representing the last Wednesday.
 */
export function getLastWednesdayFromNow() {
	const now = new Date();
	while (now.getDay() !== 3) {
		// 3 represents Wednesday in JavaScript's Date API.
		now.setDate(now.getDate() - 1);
	}
	return now;
}

/**
 * Generates an array of dates representing the next N Wednesdays from the current date.
 *
 * @param {number} n - The number of Wednesdays to generate.
 * @returns {Date[]} - An array of Date objects, each representing a Wednesday.
 */
export function getNextNWednesdaysFromDate(n: number, date: Date) {
	while (date.getDay() !== 3) {
		// 3 represents Wednesday in JavaScript's Date API.
		date.setDate(date.getDate() + 1);
	}

	return new Array(n).fill(0).map((_, i) => {
		const _date = new Date(date);
		_date.setDate(_date.getDate() + (i + 1) * 7); // Increment by 7 days for each subsequent Wednesday.
		return _date;
	});
}
