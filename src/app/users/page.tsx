import { db } from "@/lib/db";
import { users as usersSchema } from "@/lib/db/schemas/users";
import { UsersTable } from "./UserTable";
import { AddUserDialog } from "./AddUserForm";
import { PageTransitionWrapper } from "../PageTransition";

/** This should display a table of the users from the database */
export default async function UsersPage() {
	const users = await db.select().from(usersSchema);

	return (
		<PageTransitionWrapper className="container flex flex-col gap-4">
			<h2 className="mb-4 font-semibold text-lg">Users</h2>
			<UsersTable data={users} />
			<p className="text-neutral-600 text-sm">Use the <code>/user</code> command on discord to add a user with the Discord ID automatically added</p>
			<div>
				<AddUserDialog />
			</div>
		</PageTransitionWrapper>
	);
}
