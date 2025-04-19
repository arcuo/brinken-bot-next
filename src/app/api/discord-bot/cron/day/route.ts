import { handleDay } from "@/app/actions/cron";

export async function GET() {
	// Handle day cron

	handleDay();
}
