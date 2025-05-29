import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),

		// Database
		/** The url that connects to the database. */
		DATABASE_URL: z.string().min(1),

		// Discord
		/** The bot token. You can get this from the Discord Developer Portal at https://discord.com/developers/applications/1358796040605532191/bot */
		DISCORD_BOT_TOKEN: z.string().min(1),
		/** The application id of the bot. You can get this from the Discord Developer Portal at https://discord.com/developers/applications/1358796040605532191/information */
		DISCORD_APPLICATION_ID: z.string().min(1),
		/** The public key of the bot. You can get this from the Discord Developer Portal at https://discord.com/developers/applications/1358796040605532191/information */
		DISCORD_PUBLIC_KEY: z.string().min(1),
		/** The guild id of the guild where the bot is running */
		GUILD_ID: z.string().min(1),

		// Default channels. You can set the channels in the app or default using these env variables
		DINNER_CHANNEL_ID: z.string().min(1).optional(),
		BIRTHDAY_CHANNEL_ID: z.string().min(1).optional(),
		GENERAL_CHANNEL_ID: z.string().min(1).optional(),
		DOODLE_CHANNEL_ID: z.string().min(1).optional(),

		// Vercel
		/** A production domain name of the project. We select the shortest production custom domain, or vercel.app domain if no custom domain is available. Note, that this is always set, even in preview deployments. This is useful to reliably generate links that point to production such as OG-image URLs. The value does not include the protocol scheme https://. */
		VERCEL_PROJECT_PRODUCTION_URL: z.string(),
		/** A secret key set in the Vercel project settings. This is used to secure the cron job endpoint. */
		CRON_SECRET: z.string().min(8),

		// CLERK
		/** The secret key for the Clerk user authentication. Checkout https://dashboard.clerk.com/  */
		CLERK_SECRET_KEY: z.string().min(1),

		// Brinken links
		MOVING_IN_GUIDE_URL: z.string().url().optional(),
		HOUSE_MEETING_DOCS_URL: z.string().url().optional(),
	},
	client: {
		/** The public key for the Clerk user authentication. Checkout https://dashboard.clerk.com/  */
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		// NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
	},
	// If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
	// runtimeEnv: {
	//   DATABASE_URL: process.env.DATABASE_URL,
	//   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	// },
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		// NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
});
