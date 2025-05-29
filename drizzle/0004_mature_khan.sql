CREATE TABLE "doodles" (
	"id" serial PRIMARY KEY NOT NULL,
	"deadline" date NOT NULL,
	"link" text NOT NULL,
	"level" text DEFAULT 'light',
	"message" text
);
