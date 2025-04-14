import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
} from "discord.js";
import { createResponse, type Command } from ".";
import { env } from "@/env";

export const addUserCommand = {
	id: "add-user",
	data: new SlashCommandBuilder()
		.setName("add-user")
		.setDescription("Add a user to the database through the link"),
	execute(body) {
		const discordId = body.member?.user.id;
		const name = body.member?.user.global_name;
		const nickname = body.member?.nick;
		const url = new URL(
			`${env.VERCEL_URL ?? "http://localhost:3000"}/users/add`,
		);
		url.searchParams.append("discordId", discordId ?? "");
		url.searchParams.append("name", name ?? "");
		url.searchParams.append("nickname", nickname ?? "");
		return createResponse({
			data: {
				content: "Click the button below to add yourself to the database.",
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents([
							new ButtonBuilder()
								.setLabel("Add User")
								.setStyle(ButtonStyle.Link)
								.setURL(url.toString()),
						])
						.toJSON(),
				],
			},
		});
	},
} as const satisfies Command;

export const viewUsersCommand = {
	id: "view-users",
	data: new SlashCommandBuilder()
		.setName("view-users")
		.setDescription("View all users in the database"),
	execute(body) {
		// Logic to fetch and display users from the database
		return createResponse({
			data: {
				content: "Here are all the users in the database.",
				// Add logic to display users here
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents([
							new ButtonBuilder()
								.setLabel("View Users")
								.setStyle(ButtonStyle.Link)
								.setURL(`${env.VERCEL_URL ?? "http://localhost:3000"}/users`),
						])
						.toJSON(),
				],
			},
		});
	},
} as const satisfies Command;

export default [addUserCommand, viewUsersCommand];
