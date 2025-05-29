import { db } from "@/lib/db";
import { doodles } from "@/lib/db/schemas/doodles";
import { sendMessageToChannel } from "@/lib/discord/client";
import { inArray } from "drizzle-orm";
import { DateTime } from "@/lib/utils";

/**
 * Creates a message for the doodle channel
 * @param message Extra message to prepend to the doodle message.
 * @param doodle The doodle to create the message for.
 * @param deadline Whether to include the deadline in the message.
 * @returns String containing the message.
 */
export function createDoodleChannelMessage(
	message: string,
	doodle: typeof doodles.$inferSelect,
	deadline = true,
) {
	const messageToSend = `
## :robot: :calendar_spiral: Doodle: ${doodle.title}
${message}

Please take a look and fill out the doodle here if you haven't already :raised_hands: : ${doodle.link}
${
	doodle.description
		? `### Description
${doodle.description}`
		: ""
}
`;

	if (deadline) {
		const deadlineDateTime = DateTime.fromJSDate(doodle.deadline);
		return `${messageToSend}
### Deadline
The deadline for this doodle is **${deadlineDateTime.toFormat("dd LLL yyyy")}** (in ${Math.round(
			deadlineDateTime.diffNow("days").days,
		)} days).
                `;
	}

	return messageToSend;
}

export async function handleDoodles(doodleChannelId: string) {
	const doodles = await getDoodles();
	const doodlesToUpdate: number[] = [];
	for (const doodle of doodles) {
		const deadline = DateTime.fromJSDate(doodle.deadline);
		// Check if the doodle is due tomorrow
		if (deadline.diffNow("days").days < 1) {
			sendMessageToChannel(doodleChannelId, {
				content: createDoodleChannelMessage("Doodle is due today!", doodle),
			});
			doodlesToUpdate.push(doodle.id);
			continue;
		}

		const lastMessage = DateTime.fromJSDate(doodle.lastMessage);
		// Handle different warning levels
		switch (doodle.level) {
			case "light":
				// Check if the message was sent more than a week ago
				if (lastMessage.diffNow("days").days > 7) {
					sendMessageToChannel(doodleChannelId, {
						content: createDoodleChannelMessage(
							"Doodle reminder!",
							doodle,
							true,
						),
					});
					doodlesToUpdate.push(doodle.id);
				}
				break;
			case "medium":
				if (lastMessage.diffNow("days").days > 3) {
					sendMessageToChannel(doodleChannelId, {
						content: createDoodleChannelMessage(
							"Doodle reminder!",
							doodle,
							true,
						),
					});
					doodlesToUpdate.push(doodle.id);
				}
				break;
			case "heavy":
				if (lastMessage.diffNow("days").days > 1) {
					sendMessageToChannel(doodleChannelId, {
						content: createDoodleChannelMessage(
							"Doodle heavy reminder!",
							doodle,
							true,
						),
					});
					doodlesToUpdate.push(doodle.id);
				}
				break;
		}
	}

	if (doodlesToUpdate.length > 0) {
		await updateDoodleLastMessage(doodlesToUpdate, DateTime.now().toJSDate());
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
}
