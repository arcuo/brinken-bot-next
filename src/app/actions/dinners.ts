"use server";

import { db } from "@/lib/db";
import { dinners as dinnerSchema } from "@/lib/db/schemas/dinners";
import { users } from "@/lib/db/schemas/users";
import {
	generateAllPairings,
	getNextNWednesdaysFromDate,
} from "@/lib/pairings";
import { asc, gte, eq, aliasedTable, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const headchef = aliasedTable(users, "headchef");
const souschef = aliasedTable(users, "souschef");

export type DinnerDate = {
	dinner: typeof dinnerSchema.$inferSelect;
	headchef: typeof headchef.$inferSelect;
	souschef: typeof souschef.$inferSelect;
};

export async function getAllNextDinners() {
	// Fetch all dinners from the database
	// This is a placeholder function. You should implement the actual logic to fetch all dinners from your database.
	const dinners = await db
		.select()
		.from(dinnerSchema)
		.where(gte(dinnerSchema.date, new Date()))
		.leftJoin(headchef, eq(dinnerSchema.headchefId, headchef.id))
		.leftJoin(souschef, eq(dinnerSchema.souschefId, souschef.id))
		.orderBy(asc(dinnerSchema.date));
	return dinners as unknown as DinnerDate[];
}

export async function getDinnerSchedule() {
	// Fetch the dinner schedule from the database
	// This is a placeholder function. You should implement the actual logic to fetch the dinner schedule from your database.
	const prepared = db
		.select()
		.from(dinnerSchema)
		.where(gte(dinnerSchema.date, new Date()))
		.leftJoin(headchef, eq(dinnerSchema.headchefId, headchef.id))
		.leftJoin(souschef, eq(dinnerSchema.souschefId, souschef.id))
		.orderBy(asc(dinnerSchema.date))
		.limit(10)
		.prepare("dinners");

	let dinnerSchedule = (await prepared.execute()) as unknown as DinnerDate[];

	if (dinnerSchedule.length < 10) {
		// Add new scheduled dates
		const lastDinnerDate = await db
			.select({ date: dinnerSchema.date })
			.from(dinnerSchema)
			.orderBy(desc(dinnerSchema.date))
			.limit(1);

		await addNewScheduledDinners(lastDinnerDate[0].date);
		dinnerSchedule = prepared.execute() as unknown as DinnerDate[];
	}

	return dinnerSchedule;
}

export async function getDinnerByDate(date: Date) {
	// Fetch a specific dinner by date from the database
	const dinnerDate = await db
		.select()
		.from(dinnerSchema)
		.where(eq(dinnerSchema.date, date))
		.leftJoin(headchef, eq(dinnerSchema.headchefId, headchef.id))
		.leftJoin(souschef, eq(dinnerSchema.souschefId, souschef.id))
		.execute();
	return dinnerDate as unknown as DinnerDate[];
}

export async function addNewScheduledDinners(fromDate: Date) {
	const userIds = await db.select({ id: users.id }).from(users);
	const pairings = generateAllPairings(userIds.length);

	const dates = getNextNWednesdaysFromDate(pairings.length, fromDate);
	const dinnerDates: (typeof dinnerSchema.$inferInsert)[] = pairings.map(
		([main, sous], i) => ({
			headchefId: userIds[main].id,
			souschefId: userIds[sous].id,
			date: dates[i],
		}),
	);

	await db.insert(dinnerSchema).values(dinnerDates);
}

/** Remove all dinners and add new dinners */
export async function rescheduleDinners() {
	await db.delete(dinnerSchema);
	await addNewScheduledDinners(new Date());
	console.log("Dinners rescheduled");
	revalidatePath("/dinners");
}

export async function updateDinner(dinner: typeof dinnerSchema.$inferSelect) {
	await db
		.update(dinnerSchema)
		.set(dinner)
		.where(eq(dinnerSchema.id, dinner.id));
	revalidatePath("/dinners");
}
