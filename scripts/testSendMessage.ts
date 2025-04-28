import { getLastWednesdayOfMonth } from "@/app/actions/housemeeting";
import * as cron from "cron";
import { DateTime } from "luxon";

const lastWednesdayOfMonthCron = new cron.CronTime("0 0 * * wed");

console.log(getLastWednesdayOfMonth(DateTime.fromISO("2025-05-01")));

process.exit(0);
