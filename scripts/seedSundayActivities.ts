// This script will seed the sundayActivities table with random data.

import { db } from "../src/lib/db";
import { sundayActivities } from "../src/lib/db/schemas/sundayActivities";
import { users } from "../src/lib/db/schemas/users";

export async function seedSundayActivities(n: number) {
	console.log(`Seeding sundayActivities table with ${n} entries...`);

	// Fetch all users to get discord_ids
	const allUsers = await db.select({ discordId: users.discordId }).from(users);
	const discordIds = shuffleArray(allUsers.map((user) => user.discordId));

	if (discordIds.length === 0) {
		console.error(
			"No users found in the database. Cannot seed sundayActivities.",
		);
		return;
	}

	const entries = [];
	let currentDate = getNextSunday(new Date());

	for (let i = 0; i < n; i++) {
		const discordId = discordIds[i % discordIds.length]; // Distribute discord_ids evenly
		entries.push({
			date: currentDate,
			discordId: discordId,
			activity: `Activity for ${currentDate.toDateString()}`, // Placeholder activity
		});

		// Move to the next Sunday
		currentDate = getNextSunday(currentDate);
	}

	// Insert entries into the database
	await db.insert(sundayActivities).values(entries);

	console.log(`Successfully seeded ${n} entries into sundayActivities table.`);
}

// Helper function to get the next Sunday from a given date
function getNextSunday(date: Date): Date {
	const resultDate = new Date(date);
	const day = resultDate.getDay();
	const diff = resultDate.getDate() - day + (day === 0 ? 0 : 7); // Adjust if date is already Sunday
	resultDate.setDate(diff);
	resultDate.setHours(0, 0, 0, 0); // Set time to beginning of the day
	return resultDate;
}

export function shuffleArray(array: any[], iterations = array.length * 3) {
  const result = array.slice();
	for (let i = 0; i < iterations; i++) {
		const i = Math.round(Math.random() * array.length) % array.length;
		const j =
			(i + Math.round(Math.random() * (array.length - i))) % array.length;
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}
