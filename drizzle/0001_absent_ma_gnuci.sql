CREATE TYPE "public"."log_type" AS ENUM('info', 'error');--> statement-breakpoint
CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"data" json,
	"log_type" "log_type" DEFAULT 'info',
	"created_at" timestamp DEFAULT now() NOT NULL
);
