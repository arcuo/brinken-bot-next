import { SlashCommandBuilder } from "discord.js";
import { createResponseWithWithLinkButton, type Command } from ".";
import { getDinnerSchedule } from "@/app/actions/dinners";
import { DateTime } from "@/lib/utils";
import { env } from "@/env";

const dinnerSchedule = {
	id: "dinner-schedule",
	data: new SlashCommandBuilder()
		.setName("get-dinner-schedule")
		.setDescription("Get the dinner schedule for the future"),
	async execute() {
		const schedule = await getDinnerSchedule();

		return createResponseWithWithLinkButton({
			data: {
				content: `
# Dinner Schedule
Here are the upcoming dinners and chefs :spaghetti:
${schedule
	.map(({ dinner, headchef, souschef }) => {
		const date = DateTime.fromJSDate(dinner.date);
		return `- **${date.toFormat("dd/MM/yy")}** 
  - :cook: Chef ${headchef?.name ?? "Missing! Who will help?"} ${headchef ? `(<@${headchef.discordId}>)` : ""} 
  - :cook: Sous Chef ${souschef?.name ?? "Missing! Who will help?"} ${souschef ? `(<@${souschef.discordId}>)` : ""}`;
	})
	.join("\n")}
`,
			},
			link: {
				text: "Manage chefs",
				url: `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/dinners`,
			},
		});
	},
} as const satisfies Command;

export default [dinnerSchedule];
