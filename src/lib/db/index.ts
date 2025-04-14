import { users } from "./schemas/users";
import { dinners } from "./schemas/dinners";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle({
	client,
	schema: {
		users,
		dinners,
	},
});