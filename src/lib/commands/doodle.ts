// Command to create a doodle message with warnings
// It should take a link to the doodle poll, an optional description, a deadline date and warning level (light, medium, heavy)
// The command should create a entry in the doodle table with the link, description, deadline date and warning level
// The daily cron should then check if there is a doodle and message warnings.

// Light: 2 warnings
// Medium: 3 warnings
// Heavy: 4 warnings

import { SlashCommandBuilder, type APIInteraction } from "discord.js";
import { createResponse, interactionHasOptions, type Command } from ".";
import { DateTime } from "luxon";
import { db } from "../db";
import { type DoodleInsert, doodles } from "../db/schemas/doodles";
import { z } from "zod";

function createDoodleMessage(message: string) {
	return `
### :robot: :calendar_spiral: Creating doodle 


${message}
`;
}

const doodleCommand = {
	id: "doodle-command",
	data: new SlashCommandBuilder()
		.setName("doodle")
		.setDescription(
			"Start a doodle in the doodle channel. Requires a link to the doodle poll and a deadline date.",
		)
		.addStringOption((option) =>
			option
				.setName("link")
				.setDescription("Link to the doodle poll")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("deadline")
				.setDescription("Deadline date for the doodle in dd-MM format")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("description")
				.setDescription("Description of the doodle")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("warning-level")
				.setDescription("Warning level for the doodle")
				.setRequired(false)
				.addChoices(
					{ name: "Light (once a week)", value: "light" },
					{ name: "Medium (twice a week)", value: "medium" },
					{ name: "Heavy (every day, use sparingly)", value: "heavy" },
				),
		),
	async execute(body: APIInteraction) {
		// Logic to create a doodle entry in the database
		if (interactionHasOptions(body)) {
			const [link, deadline, ...optionals] = body.data.options;

			// Check if the deadline date is valid
			const deadlineDate = DateTime.fromFormat(deadline.value, "dd-MM");
			if (!deadlineDate.isValid) {
				return createResponse({
					data: {
						content: createDoodleMessage(
							`The deadline date "${deadline.value}" is invalid. Please use the format "dd-MM" (e.g. 01-01). :warning:`,
						),
					},
				});
			}

			// Check if url is valid
			const url = z.string().url().safeParse(link.value);
			if (!url.success) {
				return createResponse({
					data: {
						content: createDoodleMessage(
							`The link "${link.value}" is not a valid url. :warning:`,
						),
					},
				});
			}

			const description = optionals.find((o) => o.name === "description");
			const warningLevel = optionals.find((o) => o.name === "warning-level");

			const doodle: DoodleInsert = {
				link: link.value,
				deadline: deadlineDate.toJSDate(),
				description: description?.value,
				level: warningLevel?.value as "light" | "medium" | "heavy",
			};

			await db.insert(doodles).values(doodle);

			return createResponse({
				data: {
					content: `
A doodle has been created with the following details:
- Link: ${doodle.link}
- Description: ${doodle.description}
- Deadline: ${doodle.deadline}
- Warning level: ${describeWarningLevel(doodle.level)}

_Note: There will always be a warning on the day before the doodle deadline._
			`,
				},
			});
		}

		return {} as any;
	},
} as const satisfies Command;

function describeWarningLevel(level: DoodleInsert["level"]) {
	switch (level) {
		case "light":
			return "Light warnings: Once a week until the deadline";
		case "medium":
			return "Medium warnings: Twice a week until the deadline";
		case "heavy":
			return "Heavy warnings: Every day until the deadline";
	}
}

export default [doodleCommand];
