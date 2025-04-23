import { DateTime } from "luxon";
import { PageTransitionWrapper } from "../PageTransition";
import { DinnersTable } from "./DinnersTable";
import { getAllNextDinners } from "@/app/actions/dinners";
import { getAllUsers } from "../actions/users";
import { Button } from "@/components/ui/button";

export default async function DinnersPage() {
	const [dinners, users] = await Promise.all([
		await getAllNextDinners(),
		await getAllUsers(),
	]);

	return (
		<PageTransitionWrapper className="container flex flex-col gap-4">
			<h2 className="text-lg text-neutral-600">Dinner Schedule</h2>
			<p className="-mt-4 text-neutral-600 text-sm">
				Today is: {DateTime.now().toFormat("EEEE, dd LLL yyyy")}
			</p>
			<DinnersTable data={dinners} users={users} />
		</PageTransitionWrapper>
	);
}
