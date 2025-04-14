"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
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
import { Edit, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { EditUserDialog } from "./EditUserDialog";

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
		header: "Birthday",
		cell({ row }) {
			const birthday = row.getValue<string>("birthday");
			return birthday
				? DateTime.fromISO(birthday).toFormat("dd LLL yyyy")
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
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
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
