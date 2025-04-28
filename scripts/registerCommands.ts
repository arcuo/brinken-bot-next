import { commands } from "@/lib/commands";
import info from "@/lib/commands/info";
import { Routes, type APIApplicationCommand } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";

async function registerCommands() {
	const token = process.env.DISCORD_BOT_TOKEN;
	const rest = new REST().setToken(token!);
	try {
		await rest.put(
			Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!),
			{ body: [...commands, ...info].map((command) => command.data.toJSON()) },
		);

		const registerCommands = (await rest.get(
			Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!),
		)) as APIApplicationCommand[];
		console.log(
			"Current registered commands:",
			registerCommands.map((c) => c.name),
		);
	} catch (error) {
		console.error("Error registering commands:", error);
	}
}

registerCommands();
