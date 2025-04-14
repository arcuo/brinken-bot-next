"use client";

import type { users } from "@/lib/db/schemas/users";
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { AddUserForm } from "./AddUserForm";
import { updateUser } from "../actions/users";
import { useState } from "react";

export function EditUserDialog({ user }: { user: typeof users.$inferSelect }) {
    const [isOpen, setIsOpen] = useState(false);
	// This component is a placeholder for the Edit User dialog.
	// You can implement the actual logic to edit user details here.

	return (
		<Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<PencilIcon />
				</Button>
			</Dialog.DialogTrigger>
			<Dialog.DialogContent>
				<Dialog.DialogHeader>
					<Dialog.DialogTitle>Edit User</Dialog.DialogTitle>
					<Dialog.DialogDescription>
						Edit the details of {user?.name}.
					</Dialog.DialogDescription>
				</Dialog.DialogHeader>
				<AddUserForm
					user={user}
					onSubmit={async (values) => {
						await updateUser({
							...user,
							...values,
							birthday: values.birthday.toISOString(),
						});
                        setIsOpen(false);
					}}
                    submitText="Update User"
				/>
			</Dialog.DialogContent>
		</Dialog.Dialog>
	);
}
