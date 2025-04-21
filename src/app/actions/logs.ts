"use server";

import { db } from "@/lib/db";
import { logs } from "@/lib/db/schemas/logs";
import { revalidatePath } from "next/cache";

export async function clearLogs() {
	await db.delete(logs);
	revalidatePath("/logs");
}

export async function reloadLogs() {
	revalidatePath("/logs");
}
