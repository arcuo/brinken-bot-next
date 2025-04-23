import { LogsTable } from "./LogsTable";
import { logs as logsSchema } from "@/lib/db/schemas/logs";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { PageTransitionWrapper } from "../PageTransition";

export default async function Logs() {
	const logs = await db
		.select()
		.from(logsSchema)
		.orderBy(desc(logsSchema.createdAt));

	return (
		<PageTransitionWrapper className="container flex flex-col gap-4">
			<LogsTable data={logs} />
		</PageTransitionWrapper>
	);
}
