CREATE TYPE "public"."setting_enum" AS ENUM('birthday_channel_id', 'dinner_channel_id', 'general_channel_id');--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"setting_id" "setting_enum" NOT NULL,
	"value" jsonb NOT NULL,
	CONSTRAINT "settings_setting_id_unique" UNIQUE("setting_id")
);
