CREATE TABLE "sunday_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "dinner_headchefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "dinner_souschefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" ALTER COLUMN "headchefId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dinner" ALTER COLUMN "souschefId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sunday_activities" ADD CONSTRAINT "sunday_activities_discord_id_users_discordId_fk" FOREIGN KEY ("discord_id") REFERENCES "public"."users"("discordId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_headchefId_users_id_fk" FOREIGN KEY ("headchefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_souschefId_users_id_fk" FOREIGN KEY ("souschefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;