CREATE TABLE "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_channel_id" text NOT NULL,
	"birthday_recipient_discord_id" varchar(50),
	"birthday_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dinner" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"headchefId" integer NOT NULL,
	"souschefId" integer NOT NULL,
	CONSTRAINT "dinner_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"discordId" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"nickname" varchar(255),
	"birthday" date NOT NULL,
	"phone" varchar(8),
	CONSTRAINT "users_discordId_unique" UNIQUE("discordId")
);
--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_birthday_recipient_discord_id_users_discordId_fk" FOREIGN KEY ("birthday_recipient_discord_id") REFERENCES "public"."users"("discordId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_headchefId_users_id_fk" FOREIGN KEY ("headchefId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_souschefId_users_id_fk" FOREIGN KEY ("souschefId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;