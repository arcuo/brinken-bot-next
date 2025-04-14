CREATE TABLE "mumsdag" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"headchefId" integer NOT NULL,
	"souschefId" integer NOT NULL,
	CONSTRAINT "mumsdag_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"nickname" varchar(255) NOT NULL,
	"birthday" date NOT NULL,
	"phone" varchar(8)
);
--> statement-breakpoint
ALTER TABLE "mumsdag" ADD CONSTRAINT "mumsdag_headchefId_users_id_fk" FOREIGN KEY ("headchefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mumsdag" ADD CONSTRAINT "mumsdag_souschefId_users_id_fk" FOREIGN KEY ("souschefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;