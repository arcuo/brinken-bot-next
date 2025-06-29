"use client";

import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableHeader } from "@/components/ui/table";

import type { User } from "@/lib/db/schemas/users";
import { DateTime } from "@/lib/utils";
import { DeleteDialog } from "@/components/DeleteDialog";
import { deleteUser } from "@/app/actions/users";
import { EditUserDialog } from "./EditUserDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<User>();

const columns = [
	columnHelper.accessor("name", {
		header: "Name",
	}),
	columnHelper.accessor("nickname", {
		header: "Nickname",
	}),
	columnHelper.accessor("birthday", {
		header: ({ column }) => {
			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Birthday
							{!column.getIsSorted() ? (
								<ArrowUpDown className="ml-2 h-4 w-4" />
							) : column.getIsSorted() === "asc" ? (
								<ArrowUp className="ml-2 h-4 w-4" />
							) : (
								<ArrowDown className="ml-2 h-4 w-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Sorting by the birthday of the user (ignoring the year).</p>
					</TooltipContent>
				</Tooltip>
			);
		},
		sortingFn: (a, b) => {
			const aBirthday = DateTime.fromJSDate(a.getValue("birthday")).toFormat(
				"MM-dd",
			);
			const bBirthday = DateTime.fromJSDate(b.getValue("birthday")).toFormat(
				"MM-dd",
			);
			return aBirthday.localeCompare(bBirthday);
		},
		cell({ row }) {
			const birthday = row.getValue<Date>("birthday");
			return birthday
				? DateTime.fromJSDate(birthday).toFormat("dd LLL yyyy")
				: "N/A";
		},
	}),
	columnHelper.accessor("discordId", {
		header: "Discord ID",
	}),
	columnHelper.display({
		id: "actions",
		header: "Actions",
		meta: {
			headerProps: { className: cn("text-right") },
		},
		cell({ row }) {
			const user = row.original;
			return (
				<div className="flex justify-end gap-2">
					<DeleteDialog
						title="Delete User"
						description={`Are you sure you want to delete ${user.name}? This will also delete all the dinners this user is part of.`}
						onConfirm={async () => await deleteUser(user.id)}
					/>
					<EditUserDialog user={user} />
				</div>
			);
		},
	}),
];

interface DataTableProps {
	data: User[];
}

export function UsersTable({ data }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<Table>
			<TableHeader table={table} />
			<TableBody table={table} />
		</Table>
	);
}
