"use server";

import { db } from "@/lib/db";
import { dinners } from "@/lib/db/schemas/dinners";
import { users, type User } from "@/lib/db/schemas/users";
import { sortBirthdays } from "@/lib/utils";
import { eq, or } from "drizzle-orm";
import { DateTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const userCache: User[] = [];

export async function addUser(user: typeof users.$inferInsert) {
	// Add user to the database
	const newUser = await db.insert(users).values([user]).returning();
	console.log("New user added:", newUser);
	revalidatePath("/users");
	return newUser;
}

export async function updateUser(user: typeof users.$inferSelect) {
	// Update user in the database
	await db.update(users).set(user).where(eq(users.id, user.id));
	console.log(`User with ID ${user.id} updated:`, user);
	revalidatePath("/users");
}

export async function deleteUser(userId: number) {
	// Delete user from the database
	await db.delete(users).where(eq(users.id, userId));
	await db
		.delete(dinners)
		.where(or(eq(dinners.headchefId, userId), eq(dinners.souschefId, userId)));
	console.log(`User with ID ${userId} deleted.`);
	revalidatePath("/users");
}

export async function getAllUsers(noCache = false) {
	// Fetch all users from the database
	if (!noCache && userCache.length > 0) {
		return userCache;
	}
	userCache.push(...(await db.select().from(users)));
	return [...userCache];
}

export async function getBirthdayUsersAndResponsible(
	date: DateTime = DateTime.now(),
) {
	const users = (await getAllUsers()).sort((a, b) =>
		sortBirthdays(a.birthday, b.birthday),
	);

	// Find first where birthday is after the given date
	const dateFormatted = date.toFormat("MM-dd");
	const birthdayUsers = users.filter(
		(user) =>
			DateTime.fromJSDate(user.birthday).toFormat("MM-dd") === dateFormatted,
	);

	if (birthdayUsers.length === 0) {
		return {
			responsible: null,
			users: null,
		};
	}

	// Fetch responsibles who are the one with the last birthday
	const beforeDate = DateTime.fromJSDate(birthdayUsers[0].birthday).toFormat(
		"MM-dd",
	);
	const responsible =
		users.findLast(
			(user) =>
				DateTime.fromJSDate(user.birthday).toFormat("MM-dd") < beforeDate,
		) ?? users.at(-1);

	return {
		responsible: responsible!,
		users: birthdayUsers,
	};
}
