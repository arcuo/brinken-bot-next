import { db } from "@/lib/db";
import { logs } from "@/lib/db/schemas/logs";
import { eq } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	// Logic to fetch and display logs from the database
	const { id } = await params;
	const log = await db
		.select()
		.from(logs)
		.where(eq(logs.id, Number(id)))
		.limit(1);
	console.log(log);

	return Response.json(log[0].data, { status: 200 });
}
