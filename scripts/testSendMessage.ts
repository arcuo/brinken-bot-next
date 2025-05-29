import { getNextDinner } from "@/app/actions/dinners";
import { DateTime } from "@/lib/utils";

const nextDinnerDay = await getNextDinner();

console.log(
	DateTime.fromJSDate(nextDinnerDay.dinner.date).set({ hour: 13, minute: 0 }),
);

process.exit(0);
