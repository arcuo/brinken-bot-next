"use server";

import { db } from "@/lib/db";
import { dinners as dinnerSchema } from "@/lib/db/schemas/dinners";
import { users } from "@/lib/db/schemas/users";
import {
	createPollToChannel,
	sendMessageToChannel,
} from "@/lib/discord/client";
import { log } from "@/lib/log";
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

export async function updateDinner(
	dinner: typeof dinnerSchema.$inferSelect,
	update: {
		type: "headchef" | "souschef";
		fromName: string;
		toName: string;
	},
) {
	log(
		`Update dinner ${DateTime.fromJSDate(dinner.date).toFormat("dd/MM/yyyy")} ${update.type} from ${update.fromName} to ${update.toName}`,
	);
	await db
		.update(dinnerSchema)
		.set(dinner)
		.where(eq(dinnerSchema.id, dinner.id));
	revalidatePath("/dinners");
}

/**
 * Runs the dinner message logic.
 * The function runs if the `day` is today.
 * Will optionally send a poll if `sendPoll` is true.
 */
export async function handleDinnerMessage(opts: {
	dinnerChannelId: string;
	/** Day that the message and poll will be sent. Default is Sunday */
	message: string;
	/** The day the message will be sent. Default is Sunday */
	day:
		| "Monday"
		| "Tuesday"
		| "Wednesday"
		| "Thursday"
		| "Friday"
		| "Saturday"
		| "Sunday";
	/** Whether to send a poll or not. Default is false */
	sendPoll?: boolean;
}) {
	const { dinnerChannelId, day, sendPoll = false, message } = opts;
	const isDayOfPoll = DateTime.now().weekdayLong === day;
	if (!isDayOfPoll) return;

	// Fetch next dinner day
	const nextDinnerDay = await getNextDinner();

	if (!nextDinnerDay) {
		throw Error(
			"handleMondayBeforeDinner: Could not find a dinner date for this week in the Database",
		);
	}

	await sendMessageToChannel(dinnerChannelId, {
		content: `
# Dinner on Wednesday! :spaghetti:

${message}

**Head chef**: <@${nextDinnerDay.headchef.discordId}>
**Sous chef**: <@${nextDinnerDay.souschef.discordId}>

		`,
	});

	if (sendPoll) {
		// Set poll to stop at 13:00 on the day of the dinner
		const duration = DateTime.fromJSDate(nextDinnerDay.dinner.date)
			.set({ hour: 13 })
			.diffNow("hours").hours;

		await createPollToChannel(dinnerChannelId, {
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
}
