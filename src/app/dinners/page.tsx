import { DateTime } from "@/lib/utils";
import { PageTransitionWrapper } from "../PageTransition";
import { DinnersTable } from "./DinnersTable";
import { getAllNextDinners } from "@/app/actions/dinners";
import { getAllUsers } from "../actions/users";

export default async function DinnersPage() {
	const [dinners, users] = await Promise.all([
		await getAllNextDinners(),
		await getAllUsers(),
	]);

	return (
		<PageTransitionWrapper className="container flex flex-col gap-4">
			<h2 className="font-semibold text-lg">Dinner Schedule</h2>
			<p className="-mt-4 text-sm">
				Today is: {DateTime.now().toFormat("EEEE, dd LLL yyyy")}
			</p>
			<DinnersTable data={dinners} users={users} />
		</PageTransitionWrapper>
	);
}
