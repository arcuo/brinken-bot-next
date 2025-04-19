"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { User } from "@/lib/db/schemas/users";
import { DateTime } from "luxon";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "nickname",
		header: "Nickname",
	},
	{
		accessorKey: "birthday",
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
	},
	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "discordId",
		header: "Discord ID",
	},
	{
		id: "actions",
		header: "Actions",
		cell({ row }) {
			const user = row.original;
			return (
				<div className="flex gap-2 justify-end">
					<DeleteUserDialog userId={user.id} userName={user.name} />
					<EditUserDialog user={user} />
				</div>
			);
		},
	},
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
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
