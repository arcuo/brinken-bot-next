ALTER TABLE "doodles" RENAME COLUMN "message" TO "description";--> statement-breakpoint
ALTER TABLE "doodles" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "doodles" ADD COLUMN "lastMessage" date DEFAULT now();