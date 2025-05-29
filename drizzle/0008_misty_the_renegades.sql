ALTER TABLE "doodles" ALTER COLUMN "deadline" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "doodles" ALTER COLUMN "lastMessage" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "doodles" ALTER COLUMN "lastMessage" SET DEFAULT now();