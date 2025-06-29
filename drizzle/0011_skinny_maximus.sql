ALTER TABLE "dinner" DROP CONSTRAINT "dinner_headchefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" DROP CONSTRAINT "dinner_souschefId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_headchefId_users_id_fk" FOREIGN KEY ("headchefId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dinner" ADD CONSTRAINT "dinner_souschefId_users_id_fk" FOREIGN KEY ("souschefId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;