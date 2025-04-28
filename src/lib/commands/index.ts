import {
	type APIInteraction,
	type APIInteractionDataOptionBase,
	type APIMessageComponentInteraction,
	type ApplicationCommandOptionType,
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
} from "@discordjs/core/http-only";

import {
	ActionRowBuilder,
	ButtonBuilder,
	type InteractionReplyOptions,
	type SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import birthdays from "./birthdays";
import users from "./user";
import dinners from "./dinners";

export const commands = [...birthdays, ...users, ...dinners] as const;

export function createResponse(opts: {
	data: InteractionReplyOptions;
	type?: InteractionResponseType;
	/** Whether the message should be ephemeral or not, meaning that it should only be visible to the user who triggered the interaction. */
	ephemeral?: boolean;
}): {
	type: InteractionResponseType;
	data: InteractionReplyOptions;
} {
	const {
		type = InteractionResponseType.ChannelMessageWithSource,
		data,
		ephemeral = true,
	} = opts;

	// Handle the interaction here
	return {
		type,
		data: ephemeral
			? {
					flags: MessageFlags.Ephemeral,
					...data,
				}
			: data,
	};
}

export function createResponseWithWithLinkButton(opts: {
	data: InteractionReplyOptions;
	type?: InteractionResponseType;
	link: {text: string, url: string};
}): {
	type: InteractionResponseType;
	data: InteractionReplyOptions;
} {
	const { type = InteractionResponseType.ChannelMessageWithSource, data, link } =
		opts;
	// Handle the interaction here
	return {
		type,
		data: {
			flags: MessageFlags.Ephemeral,
			...data,
			content: `${data.content ?? ""}\n‎`, // The new line and invisible character are used to create some space for the button below
			components: [
				...(data.components ?? []),
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
						new ButtonBuilder()
							.setStyle(ButtonStyle.Link)
							.setLabel(link.text)
							.setURL(link.url)

					])
					.toJSON(),
			],
		},
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

export function interactionComponentInteraction(
	interaction: APIInteraction,
): interaction is APIMessageComponentInteraction {
	return !!interaction.message;
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
