import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
} from "discord.js";
import type { Command } from ".";
import { getDinnerSchedule } from "@/app/actions/dinners";
import { DateTime } from "luxon";
import { env } from "@/env";

const dinnerSchedule = {
	id: "dinner-schedule",
	data: new SlashCommandBuilder()
		.setName("get-dinner-schedule")
		.setDescription("Get the dinner schedule for the future"),
	async execute() {
		const schedule = await getDinnerSchedule();

		return {
			type: 4,
			data: {
				content: `# Dinner Schedule
Here are the upcoming dinners in this server :spaghetti:
${schedule
	.map(({ dinner, headchef, souschef }) => {
		const date = DateTime.fromJSDate(dinner.date);
		return `- **${date.toFormat("dd/MM/yy")}** 
  - :cook: Chef ${headchef.name} (<@${headchef.discordId}>) 
  - :cook: Sous Chef ${souschef.name} (<@${souschef.discordId}>)`;
	})
	.join("\n")}`,
			},
		};
	},
} as const satisfies Command;

export default [dinnerSchedule];
