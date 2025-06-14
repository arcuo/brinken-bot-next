"use server";
import { db } from "@/lib/db";
import { doodles, shouldSendMessageByLevel } from "@/lib/db/schemas/doodles";
import { sendMessageToChannel } from "@/lib/discord/client";
import { inArray } from "drizzle-orm";
import { createDoodleChannelMessage, DateTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function handleDoodles(doodleChannelId: string) {
	const doodles = await getDoodles();
	const doodlesToUpdate: number[] = [];
	const doodlesToRemove: number[] = [];
	for (const doodle of doodles) {
		const deadline = DateTime.fromJSDate(doodle.deadline);

		// Check if the doodle deadline is in the past
		if (deadline.diffNow("days").days < 0) {
			doodlesToRemove.push(doodle.id);
			continue;
		}

		// Check if the doodle is due tomorrow
		if (deadline.diffNow("days").days < 1) {
			sendMessageToChannel(doodleChannelId, {
				content: createDoodleChannelMessage("Doodle is due today!", doodle),
			});
			doodlesToUpdate.push(doodle.id);
			continue;
		}

		if (shouldSendMessageByLevel(doodle)) {
			sendMessageToChannel(doodleChannelId, {
				content: createDoodleChannelMessage("Doodle reminder!", doodle, true),
			});
			doodlesToUpdate.push(doodle.id);
		}
	}

	if (doodlesToUpdate.length > 0) {
		const now = DateTime.now().set({ hour: 0, minute: 0, second: 0 });
		await updateDoodleLastMessage(doodlesToUpdate, now.toJSDate());
	}

	if (doodlesToRemove.length > 0) {
		await removeDoodles(doodlesToRemove);
	}
}

export async function getDoodles() {
	return db.select().from(doodles);
}

export async function updateDoodleLastMessage(
	doodleId: number[],
	lastMessage: Date,
) {
	await db
		.update(doodles)
		.set({ lastMessage })
		.where(inArray(doodles.id, doodleId));
	revalidatePath("/doodles");
}

export async function removeDoodles(ids: number[]) {
	await db.delete(doodles).where(inArray(doodles.id, ids));
	revalidatePath("/doodles");
}
