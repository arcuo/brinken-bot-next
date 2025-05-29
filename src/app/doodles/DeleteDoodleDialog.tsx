"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeDoodles } from "@/app/actions/doodles";
import { useTransition } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

interface DeleteDoodleDialogProps {
	doodleId: number;
	doodleTitle: string;
}

export function DeleteDoodleDialog({
	doodleId,
	doodleTitle,
}: DeleteDoodleDialogProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = async () => {
		startTransition(async () => {
			await removeDoodles([doodleId]);
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" disabled={isPending}>
					<Trash2 className="h-4 w-4 text-destructive" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the
						doodle warnings for <strong>{doodleTitle}</strong>.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={"secondary"}>Cancel</Button>
					</DialogClose>
					<DialogClose onClick={handleDelete} asChild>
						<Button variant={"destructive"}>Delete</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
