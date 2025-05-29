// import { commands } from "@/lib/commands";
import { discord_auth } from "@/auth";
import { commands, type Command } from "@/lib/commands";
import info from "@/lib/commands/info";
import { error, log } from "@/lib/log";
import { InteractionType } from "@discordjs/core/http-only";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { valid, body } = await discord_auth(req);

	if (!valid) {
		if (body?.type !== InteractionType.Ping)
			await error("Discord-bot: Invalid request signature", { body });
		return NextResponse.json(
			{ error: "Invalid signature" },
			{
				status: 401,
			},
		);
	}

	if (body.type === InteractionType.Ping) {
		return NextResponse.json({
			type: 1, // Type 1 in a response is a Pong interaction response type.
		});
	}

	try {
		if (body.type === InteractionType.ApplicationCommand) {
			const command = [...commands, ...info].find(
				(c) => c.data.name === body.data.name,
			) as Command | undefined;

			if (!command) {
				return Response.json({ error: "Command not found" }, { status: 404 });
			}

			await log(`Discord-bot: Handling command: ${command.data.name}`, {
				data: { commandName: command.data.name, body },
			});

			const resp = await command.execute(body);
			if (resp) return Response.json(resp);
		}
	} catch (err) {
		await (err instanceof Error
			? error("Error handling interaction:", { message: err.message })
			: error("Error handling interaction:", { err }));
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}

	// We will return a bad request error as a valid Discord request
	// shouldn't reach here.
	return Response.json({ error: "bad request" }, { status: 400 });
}
