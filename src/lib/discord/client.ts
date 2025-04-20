import { env } from "@/env";
import {
	ChannelType,
	Client,
	Events,
	GatewayIntentBits,
	type Guild,
	type GuildChannelManager,
	type MessageCreateOptions,
	MessageFlags,
	MessageType,
	OverwriteType,
	PermissionsBitField,
	type PollData,
	TextChannel,
} from "discord.js";
import type { DateTime } from "luxon";
import type { User } from "../db/schemas/users";
import { db } from "../db";
import { channels } from "../db/schemas/channels";

export const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessagePolls,
	],
});

export async function login() {
	try {
		if (!client.isReady()) {
			await new Promise((resolve) => {
				client.once(Events.ClientReady, async (readyClient) => {
					resolve(readyClient);
				});
				client.login(process.env.DISCORD_BOT_TOKEN);
			});
			console.log("Discord logged in");
		}
	} catch (error) {
		console.log("error:", error);
	}
}

export async function deleteMessage(channelId: string, messageId: string) {
	await login();
	const channel = await client.channels.fetch(channelId);
	if (!(channel instanceof TextChannel)) {
		console.error(`Channel is not a text channel: ${channelId}`);
		return;
	}

	const messages = await channel.messages.fetch();
	const lastMessage = messages.first();
	console.log(lastMessage);

	return await channel.messages.delete(messageId);
}

export async function deleteChannels(...channelIds: string[]) {
	await login();
	const guild = await client.guilds.fetch(env.GUILD_ID);
	if (!guild) {
		console.error(`Could not find guild with id ${env.GUILD_ID}`);
		return;
	}
	console.log("Deleting channels", channelIds);

	await Promise.allSettled(
		channelIds.map((channelId) => guild.channels.delete(channelId)),
	);
}

export async function getGuild() {
	await login();
	return client.guilds.fetch(env.GUILD_ID);
}

export async function sendMessageToChannel(
	channelId: string,
	message:
		| ((channel: TextChannel) => Promise<string | MessageCreateOptions>)
		| string
		| MessageCreateOptions,
) {
	await login();
	const channel = await client.channels.fetch(channelId);
	if (!(channel instanceof TextChannel)) {
		console.error(`Channel is not a text channel: ${channelId}`);
		return;
	}
	return channel.send(typeof message === "function" ? await message(channel) : message);
}

export async function createPollToChannel(channelId: string, poll: PollData) {
	await login();
	const channel = await client.channels.fetch(channelId);
	if (!(channel instanceof TextChannel)) {
		console.error(`Channel is not a text channel: ${channelId}`);
		return;
	}
	return channel.send({
		poll,
	});
}

export async function sendMessageToUser(
	message: Parameters<TextChannel["send"]>[0],
	userId: string,
) {
	await login();
	const user = await client.users.fetch(userId);
	if (!user) {
		console.error("User not found");
		return;
	}

	const result = await user.send(message);
}

type CreateChannelOptions = { name: string } & Parameters<
	GuildChannelManager["create"]
>[0];

export async function createNewChannel(
	opts:
		| ((guild: Guild) => CreateChannelOptions)
		| ((guild: Guild) => Promise<CreateChannelOptions>)
		| CreateChannelOptions,
) {
	await login();
	const guild = await client.guilds.fetch(env.GUILD_ID);
	if (!guild) {
		console.error(`Could not find guild with id ${env.GUILD_ID}`);
		return;
	}

	const {
		name,
		type = ChannelType.GuildText,
		...rest
	} = opts instanceof Function ? await opts(guild) : opts;

	const channel = await guild.channels.create({
		name,
		type,
		...rest,
	});

	console.log("Created channel", channel.name);
	return channel;
}

export async function createBirthdayChannel(
	usersWithBirthday: User[],
	responsibles: User[],
	date: DateTime,
) {
	const channel = await createNewChannel(async (guild) => {
		await guild.roles.fetch();
		return {
			name: `${usersWithBirthday.map((x) => x.name).join("-")}-birthday-channel-${date.toFormat("dd-MM")}`,
			topic: `Planning birthdays for ${usersWithBirthday.map((x) => x.name).join(", ")} on the ${date.toFormat("dd/MM/yyyy")}`,
			permissionOverwrites: [
				...usersWithBirthday.map((x) => ({
					type: OverwriteType.Member,
					id: x.discordId,
					deny: [PermissionsBitField.Flags.ViewChannel],
				})),
				{
					type: OverwriteType.Member,
					id: (await guild.members.fetchMe()).id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					type: OverwriteType.Role,
					id: guild.roles.everyone.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
			],
		};
	});

	if (!channel) {
		console.error("Failed to create birthday channel");
		return;
	}

	// Save to channel database
	await db.insert(channels).values([
		{
			discordChannelId: channel.id,
			birthdayRecipientDiscordId: usersWithBirthday.map((x) => x.discordId)[0],
			birthdayDate: date.toJSDate(),
		},
	]);

	await channel?.send(`
# ${usersWithBirthday.map((x) => x.name).join(", ")} birthday${usersWithBirthday.length > 1 ? "s" : ""} :flag_dk:
This channel is for planning ${usersWithBirthday.map((x) => x.name).join(", ")}'s birthday${usersWithBirthday.length > 1 ? "s" : ""}.

## Responsible people
The responsible${responsibles.length > 1 ? "s" : ""} for delegating the birthday breakfast: ${responsibles
		.map((x) => `<@${x.discordId}>`)
		.join(", ")}.
`);
}
