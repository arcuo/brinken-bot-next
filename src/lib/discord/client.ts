import { env } from "@/env";
import {
	ChannelsAPI,
	GuildsAPI,
	OverwriteType,
	UsersAPI,
	type APIGuildMember,
	type APIPollMedia,
	type APIUser,
} from "@discordjs/core/http-only";
import type { DateTime } from "luxon";
import type { User } from "../db/schemas/users";
import { db } from "../db";
import { channels } from "../db/schemas/channels";
import { REST } from "@discordjs/rest";
import type { APIGuild, APIRole } from "@discordjs/core/http-only";

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN);
const guildsApi = new GuildsAPI(rest);
const channelsAPI = new ChannelsAPI(rest);
const usersAPI = new UsersAPI(rest);

export async function getGuild(guildId = env.GUILD_ID) {
	return guildsApi.get(guildId);
}

const rolesCache = new Map<string, APIRole>();
export async function getGuildRole(name: string, guildId = env.GUILD_ID) {
	const role = rolesCache.get(name);
	if (role) return role;

	const roles = await guildsApi.getRoles(guildId);
	for (const role of roles) {
		rolesCache.set(role.name, role);
	}
	return rolesCache.get(name);
}

let current: APIUser | null = null;
export async function getBotMember() {
	if (current) return current;
	current = await usersAPI.getCurrent();
	return current;
}

const membersCache = new Map<string, APIGuildMember>();
export async function getGuildMember(userId: string, guildId = env.GUILD_ID) {
	if (membersCache.has(userId)) return membersCache.get(userId);
	await getGuildMembers(guildId);
	return membersCache.get(userId);
}

export async function getGuildMembers(guildId = env.GUILD_ID) {
	const members = await guildsApi.getMembers(guildId);
	for (const member of members) {
		membersCache.set(member.user.id, member);
	}
	return members;
}

export async function getChannel(channelId: string) {
	return channelsAPI.get(channelId);
}

export async function deleteChannels(...channelIds: string[]) {
	return Promise.all(channelIds.map((id) => channelsAPI.delete(id)));
}

export async function sendMessageToChannel(
	channelId: string,
	message: Parameters<typeof channelsAPI.createMessage>[1],
) {
	return await channelsAPI.createMessage(channelId, message);
}

export async function createPollToChannel(
	channelId: string,
	opts: {
		question: APIPollMedia;
		duration: number;
		answers: { text: string; emoji?: string }[];
		allowMultiselect?: boolean;
	},
) {
	const { question, duration, answers } = opts;
	return sendMessageToChannel(channelId, {
		poll: {
			question,
			duration,
			answers: answers.map((x) => ({
				poll_media: {
					text: x.text,
					emoji: x.emoji ? { id: null, name: x.emoji } : undefined,
				},
			})),
			allow_multiselect: opts.allowMultiselect ?? false,
		},
	});
}

type CreateChannelOptions = { name: string } & Parameters<
	GuildsAPI["createChannel"]
>[1];

export async function createNewChannel(
	opts:
		| ((guild: APIGuild) => CreateChannelOptions)
		| ((guild: APIGuild) => Promise<CreateChannelOptions>)
		| CreateChannelOptions,
	guildId = env.GUILD_ID,
) {
	if (typeof opts === "function") {
		const guild = await getGuild();
		return guildsApi.createChannel(guildId, await opts(guild));
	}
	return await guildsApi.createChannel(guildId, opts);
}

const Permissions = {
	VIEW_CHANNEL: 0x00000400,
	SEND_MESSAGES: 0x00000800,
};

export async function createBirthdayChannel(
	usersWithBirthday: User[],
	responsibles: User[],
	date: DateTime,
) {
	const everyone = await getGuildRole("@everyone");
	if (!everyone) {
		throw Error("Could not find @everyone role");
	}
	const channel = await createNewChannel({
		name: `${usersWithBirthday.map((x) => x.name).join("-")}-birthday-channel-${date.toFormat("dd-MM")}`,
		topic: `Planning birthdays for ${usersWithBirthday.map((x) => x.name).join(", ")} on the ${date.toFormat("dd/MM/yyyy")}`,
		permission_overwrites: [
			...usersWithBirthday.map((x) => ({
				type: OverwriteType.Member,
				id: x.discordId,
				deny: Permissions.VIEW_CHANNEL.toString(),
			})),
			{
				type: OverwriteType.Member,
				id: (await getBotMember()).id,
				allow: (
					Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES
				).toString(),
			},
			{
				type: OverwriteType.Role,
				id: everyone.id,
				deny: (Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES).toString(),
			},
		],
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

	await sendMessageToChannel(channel.id, {
		content: `
# ${usersWithBirthday.map((x) => x.name).join(", ")} birthday${usersWithBirthday.length > 1 ? "s" : ""} :flag_dk:
This channel is for planning ${usersWithBirthday.map((x) => x.name).join(", ")}'s birthday${usersWithBirthday.length > 1 ? "s" : ""}.

## Responsible people
The responsible${responsibles.length > 1 ? "s" : ""} for delegating the birthday breakfast: ${responsibles
			.map((x) => `<@${x.discordId}>`)
			.join(", ")}.
`,
	});
}
