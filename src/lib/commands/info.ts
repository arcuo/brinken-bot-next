import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	type APIInteraction,
} from "discord.js";
import { commands, createResponse, type Command } from ".";
import { env } from "@/env";

export const infoCommand = {
	id: "info",
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get info about the bot"),
	async execute(_body: APIInteraction) {
		return createResponse({
			data: {
				content: `
# Brinken Bot :robot:
The Brinken Bot is a bot that reminds us about dinners, birthdays and house meetings. I've set up a website for the bot where you can manage the users and dinners. The Bot will check in every day and send messages to the correct channels if there is a birthday!

Visit the [bot website](https://${env.VERCEL_PROJECT_PRODUCTION_URL}) to change dinners chefs, update users and more. You need to log in to the Brinken Gmail account to access the website.

You can run the following commands:

${commands.map((c) => `- \`/${c.data.name}\` - ${c.data.description}`).join("\n")}
- \`/info\` - This command. Get info about the bot.
- \`/dev\` - Developer info.
`,
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents([
							new ButtonBuilder()
								.setStyle(ButtonStyle.Link)
								.setLabel("House meeting docs")
								.setURL(env.HOUSE_MEETING_DOCS_URL ?? ""),
							new ButtonBuilder()
								.setStyle(ButtonStyle.Link)
								.setLabel("Moving in guide")
								.setURL(env.MOVING_IN_GUIDE_URL ?? ""),
						])
						.toJSON(),
				],
			},
		});
	},
} as const satisfies Command;

export const devCommand = {
	id: "dev",
	data: new SlashCommandBuilder()
		.setName("dev")
		.setDescription("Developer info"),
	async execute(_body: APIInteraction) {
		return createResponse({
			data: {
				content: `
# Developer Info
*Author*: Bemi - benjamin.zachariae@gmail.com

The bot is developed with Discord.js, Bun and NextJS. It is hosted on Vercel.

## Links

- Github: https://github.com/arcuo/brinken-bot-next
- Readme: https://github.com/arcuo/brinken-bot-next/blob/main/README.md
`,
			},
		});
	},
};

export default [infoCommand, devCommand] as const;
