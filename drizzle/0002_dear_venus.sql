ALTER TABLE "mumsdag" RENAME TO "dinner";--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "mumsdag_date_unique";--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "mumsdag_headchefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "mumsdag_souschefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_headchefId_users_id_fk" FOREIGN KEY ("headchefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_souschefId_users_id_fk" FOREIGN KEY ("souschefId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_date_unique" UNIQUE("date");