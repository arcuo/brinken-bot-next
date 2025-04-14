"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUser } from "@/app/actions/users";
import { TrashIcon } from "lucide-react";

interface DeleteUserDialogProps {
	userId: number;
	userName: string;
}

export function DeleteUserDialog({ userId, userName }: DeleteUserDialogProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = async () => {
		await deleteUser(userId);
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant="ghost" size="icon">
						<TrashIcon />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
					</DialogHeader>
					<p>
						Are you sure you want to delete {userName}? This will also delete
						all the dinners this user is part of.
					</p>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary">Cancel</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button variant="destructive" onClick={handleDelete}>
								Delete
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
