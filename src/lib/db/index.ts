import { users } from "./schemas/users";
import { dinners } from "./schemas/dinners";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { channels } from "./schemas/channels";
import { logs } from "./schemas/logs";
import { settings } from "./schemas/settings";
import { doodles } from "./schemas/doodles";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle({
	client,
	schema: {
		users,
		dinners,
		logs,
		channels,
		settings,
		doodles,
	},
});
