import {
	type APIInteraction,
	type APIInteractionDataOptionBase,
	type ApplicationCommandOptionType,
	InteractionResponseType,
} from "@discordjs/core/http-only";

import type {
	MessagePayload,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import birthdays from "./birthdays";
import users from "./user";
import dinners from "./dinners";

export const commands = [...birthdays, ...users, ...dinners] as const;

export function createResponse(opts: {
	data: MessagePayload["body"] | MessagePayload;
	type?: InteractionResponseType;
}) {
	const { type = InteractionResponseType.ChannelMessageWithSource, data } =
		opts;
	// Handle the interaction here
	return {
		type,
		data,
	};
}

export function interactionHasOptions<T extends APIInteraction>(
	interaction: T,
): interaction is T & {
	data: {
		options: APIInteractionDataOptionBase<
			ApplicationCommandOptionType.String,
			string
		>[];
	};
} {
	return !!interaction.data && (interaction.data as any).options !== undefined;
}

export type Command = {
	id: Lowercase<string>;
	execute: (
		body: APIInteraction,
	) =>
		| Promise<ReturnType<typeof createResponse>>
		| ReturnType<typeof createResponse>;
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
};
