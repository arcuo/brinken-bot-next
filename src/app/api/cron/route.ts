import { handleDay } from "@/app/actions/cron";
import { env } from "@/env";
import { error, log } from "@/lib/log";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	log("Cron: Calling day cron");
	const headersList = await headers();
	const authorization = headersList.get("authorization");

	if (!env.CRON_SECRET || authorization !== `Bearer ${env.CRON_SECRET}`) {
		error("Cron: Unauthorized");
		return new NextResponse(null, { status: 401 });
	}

	// Handle day cron
	log("Cron: Handling day cron");
	await handleDay();
	return new NextResponse(null, { status: 200 });
}
