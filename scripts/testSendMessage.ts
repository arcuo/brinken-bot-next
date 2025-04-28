import { env } from "@/env";
import { commands } from "@/lib/commands";
import { sendMessageToChannel } from "@/lib/discord/client";

await sendMessageToChannel("1363836264746582086", {
	content: `
# Brinken Bot :robot:
The Brinken Bot is a bot that reminds us about dinners, birthdays and house meetings. I've set up a website for the bot where you can manage the users and dinners. The Bot will check in every day and send messages to the correct channels if there is a birthday!

Visit the [bot website](https://${env.VERCEL_PROJECT_PRODUCTION_URL}) to change dinners chefs, update users and more. You need to log in to the Brinken Gmail account to access the website.

You can run the following commands:

${commands.map((c) => `- \`/${c.data.name}\` - ${c.data.description}`).join("\n")}
- \`/info\` - This command. Get info about the bot.
- \`/dev\` - Developer info.
`,
});

process.exit(0);
