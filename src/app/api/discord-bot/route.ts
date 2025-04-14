// import { commands } from "@/lib/commands";
import { auth } from "@/auth";
import { commands } from "@/lib/commands";
import {
	InteractionType,
	type APIInteraction,
} from "@discordjs/core/http-only";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { valid, body } = await auth(req);
	if (!valid) {
		console.error("Middleware: Invalid request signature");
		return NextResponse.json(
			{ error: "Invalid signature" },
			{
				status: 401,
			},
		);
	}

	body as APIInteraction;

	if (body.type === InteractionType.Ping) {
		return NextResponse.json({
			type: 1, // Type 1 in a response is a Pong interaction response type.
		});
	}

	try {
		if (body.type === InteractionType.ApplicationCommand) {
			const command = commands.find((c) => c.data.name === body.data.name);

			if (!command) {
				return Response.json({ error: "Command not found" }, { status: 404 });
			}

			const resp = await command.execute(body);
			return Response.json(resp);
		}
	} catch (error) {
		error instanceof Error
			? console.error("Error handling interaction:", error.message)
			: console.error("Error handling interaction:", error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}

	// We will return a bad request error as a valid Discord request
	// shouldn't reach here.
	return Response.json({ error: "bad request" }, { status: 400 });
}
