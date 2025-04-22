import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),

		// Database
		DATABASE_URL: z.string().min(1),

		// Discord
		DISCORD_BOT_TOKEN: z.string().min(1),
		DISCORD_APPLICATION_ID: z.string().min(1),
		DISCORD_PUBLIC_KEY: z.string().min(1),
		GUILD_ID: z.string().min(1),
		DINNER_CHANNEL_ID: z.string().min(1).optional(),
		BIRTHDAY_CHANNEL_ID: z.string().min(1).optional(),
		GENERAL_CHANNEL_ID: z.string().min(1).optional(),

		// Vercel
		VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),

		// CLERK
		CLERK_SECRET_KEY: z.string().min(1),
	},
	client: {
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
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		// NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
});
