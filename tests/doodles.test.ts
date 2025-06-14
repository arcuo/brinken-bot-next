import {
	shouldSendMessageByLevel,
	type Doodle,
} from "@/lib/db/schemas/doodles";
import { describe, expect, test, beforeEach } from "bun:test";
import { DateTime } from "luxon";

describe("shouldSendMessageByLevel", () => {
	let doodle: Doodle;

	beforeEach(() => {
		doodle = {
			id: 1,
			deadline: new Date("2025-01-29"),
			level: "light",
			lastMessage: new Date("2025-01-27"),
			link: "",
			title: "",
			description: null,
		};
	});

	describe("light", () => {
		beforeEach(() => {
			doodle.level = "light";
			doodle.lastMessage = new Date("2025-01-06");
		});
		test("should return true if the lastMessage is more than a week ago", () => {
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-14")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-15")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-02-01")),
			).toBe(true);
		});

		test("should return false if the lastMessage is less than a week ago", () => {
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-07")),
			).toBe(false);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-09")),
			).toBe(false);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-12")),
			).toBe(false);
		});
	});

	describe("medium", () => {
		beforeEach(() => {
			doodle.level = "medium";
			doodle.lastMessage = new Date("2025-01-06");
		});
		test("should return true if the lastMessage is more than 3 days ago", () => {
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-14")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-15")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-02-01")),
			).toBe(true);
		});

		test("should return false if the lastMessage is less than 3 days ago", () => {
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-07")),
			).toBe(false);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-08")),
			).toBe(false);
		});
	});

	describe("heavy", () => {
		beforeEach(() => {
			doodle.level = "heavy";
			doodle.lastMessage = new Date("2025-01-06");
		});
		test("should return true if the lastMessage is more than 1 day ago", () => {
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-14")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-15")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-02-01")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-07")),
			).toBe(true);
			expect(
				shouldSendMessageByLevel(doodle, DateTime.fromISO("2025-01-06")),
			).toBe(false);
		});
	});
});
