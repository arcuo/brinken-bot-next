import { LogsTable } from "./LogsTable";
import { logs as logsSchema } from "@/lib/db/schemas/logs";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";

export default async function Logs() {
	const logs = await db
		.select()
		.from(logsSchema)
		.orderBy(desc(logsSchema.createdAt));
	return <LogsTable data={logs} />;
}
