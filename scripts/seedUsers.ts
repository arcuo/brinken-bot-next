// This script will seed the users table with random data.

import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schemas/users";
import { faker } from "@faker-js/faker";

export async function seedUsers(n: number) {
	console.log(`Seeding users table with ${n} entries...`);

	// Remove all existing entries
	await db.delete(users);

	const entries = [];
	for (let i = 0; i < n; i++) {
		entries.push({
			discordId: faker.string.uuid(),
			name: faker.person.fullName(),
			nickname: faker.person.firstName(),
			birthday: faker.date.birthdate(),
		});
	}

	// Insert entries into the database
	await db.insert(users).values(entries);

	console.log(`Successfully seeded ${n} entries into users table.`);
}

await seedUsers(10);
process.exit(0);