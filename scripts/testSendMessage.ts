import { handleDayOfDinner, handleMondayBeforeDinner } from "@/app/actions/dinners";
import type { User } from "@/lib/db/schemas/users";
import * as discord from "@/lib/discord/client";
import { DateTime } from "luxon";

await handleDayOfDinner(true);

process.exit(0);
