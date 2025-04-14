import { db } from "@/lib/db";
import { users as usersSchema } from "@/lib/db/schemas/users";
import { UsersTable } from "./UserTable";
import { AddUserDialog } from "./AddUserForm";
import { PageTransitionWrapper } from "../PageTransition";

/** This should display a table of the users from the database */
export default async function UsersPage() {
	const users = await db.select().from(usersSchema);

	return (
		<PageTransitionWrapper className="container flex gap-4 flex-col">
			<h2 className="text-lg mb-4 text-neutral-600">Users</h2>
			<UsersTable data={users} />
			<div>
				<AddUserDialog />
			</div>
		</PageTransitionWrapper>
	);
}
