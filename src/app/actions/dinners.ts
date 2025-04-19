"use server";

import { env } from "@/env";
import { db } from "@/lib/db";
import { dinners as dinnerSchema } from "@/lib/db/schemas/dinners";
import { users } from "@/lib/db/schemas/users";
import {
	createPollToChannel,
	sendMessageToChannel,
} from "@/lib/discord/client";
import {
	generateAllPairings,
	getNextNWednesdaysFromDate,
} from "@/lib/pairings";
import { asc, gte, eq, aliasedTable, desc, gt } from "drizzle-orm";
import { DateTime } from "luxon";
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
	const todayAtMidnight = DateTime.now().set({ hour: 0, minute: 0, second: 0 });
	const dinners = await db
		.select()
		.from(dinnerSchema)
		.where(gte(dinnerSchema.date, todayAtMidnight.toJSDate()))
		.leftJoin(headchef, eq(dinnerSchema.headchefId, headchef.id))
		.leftJoin(souschef, eq(dinnerSchema.souschefId, souschef.id))
		.orderBy(asc(dinnerSchema.date));
	return dinners as unknown as DinnerDate[];
}

export async function getNextDinner() {
	const todayAtMidnight = DateTime.now().set({ hour: 0, minute: 0, second: 0 });
	return (
		await db
			.select()
			.from(dinnerSchema)
			.where(gte(dinnerSchema.date, todayAtMidnight.toJSDate()))
			.leftJoin(headchef, eq(dinnerSchema.headchefId, headchef.id))
			.leftJoin(souschef, eq(dinnerSchema.souschefId, souschef.id))
			.orderBy(asc(dinnerSchema.date))
			.limit(1)
	)[0] as unknown as DinnerDate;
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
	await db.delete(dinnerSchema).where(gt(dinnerSchema.date, new Date()));
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

/** Handle the monday before dinner. Notify chefs and send message for voting whether I'm coming */
export async function handleMondayBeforeDinner(debugging = false) {
	const isMonday = DateTime.now().weekdayLong === "Monday";
	if (!debugging && !isMonday) return;

	// Fetch next dinner day
	const nextDinnerDay = await getNextDinner();

	if (!nextDinnerDay) {
		throw Error(
			"handleMondayBeforeDinner: Could not find a dinner date for this week in the Database",
		);
	}

	const duration = DateTime.fromJSDate(nextDinnerDay.dinner.date).diffNow(
		"hours",
	).hours;

	await sendMessageToChannel(
		env.DINNER_CHANNEL_ID,
		`
# Dinner on Wednesday! :spaghetti:

@everyone We are having our regular dinner date on Wednesday! It will be awesome to see you all there! :tada:

**Head chef**: <@${nextDinnerDay.headchef.discordId}>
**Sous chef**: <@${nextDinnerDay.souschef.discordId}>

		`,
	);

	await createPollToChannel(env.DINNER_CHANNEL_ID, {
		question: {
			text: "Are you attending dinner on Wednesday?",
		},
		answers: [
			{
				text: "Yes I'm joining!",
				emoji: "🤩",
			},
			{
				text: "No I won't be joining",
				emoji: "😟",
			},
			{
				text: "I'll be joining late, leave me a plate!",
				emoji: "🍝",
			},
		],
		allowMultiselect: false,
		duration,
	});
}

export async function handleDayOfDinner(debugging = false) {
	const isWednesday = DateTime.now().weekdayLong === "Wednesday";
	if (!isWednesday && !debugging) {
		return;
	}
	// Fetch next dinner day
	const thisDinnerDay = await getNextDinner();
	if (!thisDinnerDay) {
		throw Error(
			"handleDayOfDinner: Could not find a dinner date for this week in the Database",
		);
	}

	await sendMessageToChannel(
		env.DINNER_CHANNEL_ID,
		`
# Dinner day :spaghetti:
@everyone today is dinner day with 
**Head chef**: <@${thisDinnerDay.headchef.discordId}>
**Sous chef**: <@${thisDinnerDay.souschef.discordId}>
		`,
	);
}
