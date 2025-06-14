import { env } from "@/env";
import { sendMessageToChannel } from "@/lib/discord/client";

const results = await sendMessageToChannel(env.GENERAL_CHANNEL_ID!, {
	content: "Testing sendMessageToChannel",
});

console.log(results);

process.exit(0);
