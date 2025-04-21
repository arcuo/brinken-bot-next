import { db } from "./db";
import { logs } from "./db/schemas/logs";

export async function log<T extends object>(
	message: string,
	opts?: { data?: T; logType?: "info" | "error" },
) {
	if (opts?.logType === "error") {
		console.error(message, opts.data);
	} else {
		console.log(message);
	}

	await db.insert(logs).values({ message, ...opts });
}

export async function error<T extends object>(message: string, data?: T) {
	await log(message, { data, logType: "error" });
}
