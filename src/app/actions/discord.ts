"use server";

import { env } from "@/env";
import { REST } from "@discordjs/rest";
import { ChannelType, Routes, type APIGuildChannel } from "discord.js";

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN!);

export async function getChannels(): Promise<APIGuildChannel<any>[]> {
	return (await rest.get(Routes.guildChannels(env.GUILD_ID)) as unknown as APIGuildChannel<any>[]).filter((ch) => ch.type === ChannelType.GuildText);
}
