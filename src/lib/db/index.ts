import { users } from "./schemas/users";
import { dinners } from "./schemas/dinners";
import { channels } from "./schemas/channels";
import { logs } from "./schemas/logs";
import { settings } from "./schemas/settings";
import { doodles } from "./schemas/doodles";
import { sundayActivities } from "./schemas/sundayActivities";
import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({
	client: sql,
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
