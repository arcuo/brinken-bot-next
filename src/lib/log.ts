import { db } from "./db";
import { logs } from "./db/schemas/logs";

export function log<T extends object>(
	message: string,
	opts?: { data?: T; logType?: "info" | "error" },
) {
	if (opts?.logType === "error") {
		console.error(message, opts.data);
	} else {
		console.log(message, opts?.data);
	}

	db.insert(logs).values({ message, ...opts });
}

export function error<T extends object>(message: string, data?: T) {
	log(message, { data, logType: "error" });
}
