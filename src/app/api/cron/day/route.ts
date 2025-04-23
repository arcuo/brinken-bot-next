import { handleDay } from "@/app/actions/cron";
import { log } from "@/lib/log";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	// Handle day cron
	log("Cron: Handling day cron");
	handleDay();
}
