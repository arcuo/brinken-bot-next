"use server";

import { env } from "@/env";
import { REST } from "@discordjs/rest";
import {
	ChannelType,
	GuildsAPI,
	type APIGuildChannel,
} from "@discordjs/core/http-only";

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN!);

const guildsApi = new GuildsAPI(rest);

export async function getChannels(
	guildId = env.GUILD_ID,
): Promise<APIGuildChannel<any>[]> {
	return (
		(await guildsApi.getChannels(guildId)) as unknown as APIGuildChannel<any>[]
	).filter((ch) => ch.type === ChannelType.GuildText);
}
