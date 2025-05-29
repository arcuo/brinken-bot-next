import { db } from "@/lib/db";
import { doodles as doodlesSchema } from "@/lib/db/schemas/doodles";
import { PageTransitionWrapper } from "../PageTransition";
import { DoodleTable } from "./DoodleTable";

/** This should display a table of the doodles from the database */
export default async function DoodlesPage() {
	const doodles = await db.select().from(doodlesSchema);

	return (
		<PageTransitionWrapper className="container flex flex-col gap-4">
			<h2 className="mb-4 font-semibold text-lg">Doodles</h2>
			<DoodleTable data={doodles} />
			<p className="text-neutral-600 text-sm">
				Create a doodle by using the <code>/doodle</code> command on discord!
			</p>
		</PageTransitionWrapper>
	);
}
