import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";

import { users } from "./schemas/users";
import { dinners } from "./schemas/dinners";
import { channels } from "./schemas/channels";
import { logs } from "./schemas/logs";
import { settings } from "./schemas/settings";
import { doodles } from "./schemas/doodles";
import { sundayActivities } from "./schemas/sundayActivities";

const client = postgres(env.DATABASE_URL!);

export const db = drizzle({
	client,
	schema: {
		users,
		dinners,
		logs,
		channels,
		settings,
		doodles,
		sundayActivities,
	},
});
