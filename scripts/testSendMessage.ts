import { env } from "@/env";
import { sendMessageToChannel } from "@/lib/discord/client";

const results = await sendMessageToChannel(env.GENERAL_CHANNEL_ID!, {
	content: `
# House Meeting :house_with_garden:
Remember that this is the last Wednesday of the month and the house meeting is tonight at 18:00!

Check out the notes from last house meeting [here](${env.HOUSE_MEETING_DOCS_URL}).
			`,
});

console.log(results);

process.exit(0);
