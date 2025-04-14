ALTER TABLE "users" ALTER COLUMN "nickname" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "discordId" varchar(255) NOT NULL;