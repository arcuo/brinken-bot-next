"use server";

import { db } from "@/lib/db";
import { dinners } from "@/lib/db/schemas/dinners";
import { users } from "@/lib/db/schemas/users";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function getAllUsers() {
	// Fetch all users from the database
	return db.select().from(users);
}
