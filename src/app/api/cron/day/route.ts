import { handleDay } from "@/app/actions/cron";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	// Handle day cron
	handleDay();
}
