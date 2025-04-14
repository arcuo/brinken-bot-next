import { REST, Routes } from "discord.js";
import { argv } from "node:process";

export async function setApplicationInteractionUrl() {
	let newUrl = argv[2];

	if (!newUrl) {
		console.error("Please provide a new URL");
		return;
	}
	newUrl += "/api/discord-bot";

	const discordBotToken = process.env.DISCORD_BOT_TOKEN;
	if (!discordBotToken) {
		console.error("Please set the DISCORD_BOT_TOKEN environment variable");
		return;
	}
	const applicationId = process.env.DISCORD_APPLICATION_ID;
	if (!applicationId) {
		console.error("Please set the DISCORD_APPLICATION_ID environment variable");
		return;
	}

	const rest = new REST().setToken(discordBotToken);

	console.log("Updating application interaction URL...", newUrl);
	try {
		await rest.patch(Routes.currentApplication(), {
			body: {
				interactions_endpoint_url: newUrl,
			},
		});

	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error updating application interaction URL:",
				error.message,
			);
		} else {
			console.error("Error updating application interaction URL:", error);
		}
		return;
	}
	console.log("Application interaction URL updated successfully");
	console.log("New URL:", newUrl);
}

setApplicationInteractionUrl();
