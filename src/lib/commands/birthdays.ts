import { type APIInteraction, SlashCommandBuilder } from "discord.js";
import { type Command, createResponse } from ".";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { DateTime } from "luxon";

const getBirthdays = {
	id: "get-birthdays",
	data: new SlashCommandBuilder()
		.setName("get-birthdays")
		.setDescription("Get a list of member birthdays"),
	async execute(_body: APIInteraction) {
		const u = (await db.select().from(users))
			.map((u) => {
				const nextAge =
					Math.abs(DateTime.fromJSDate(u.birthday).diffNow("years").years) + 1;
				return {
					...u,
					nextAge: Math.floor(nextAge),
				};
			})
			.sort((a, b) => {
				const aDate = DateTime.fromJSDate(a.birthday).set({ year: 0 });
				const bDate = DateTime.fromJSDate(b.birthday).set({ year: 0 });
				return aDate < bDate ? -1 : 1;
			});

		return createResponse({
			data: {
				content: `# Brinken Birthdays
Here are the birthdays of members in this server :flag_dk:
${u
	.map(
		(user) =>
			`- On the **${DateTime.fromJSDate(user.birthday)
				.setLocale("da-DK")
				.toFormat("dd. MMMM")}** ${user.nickname ?? user.name}${
				user.discordId ? ` (<@${user.discordId}>)` : ""
			} becomes  ${user.nextAge} years old!`,
	)
	.join("\n")}
`,
			},
		});
	},
} as const satisfies Command;

export default [getBirthdays];
