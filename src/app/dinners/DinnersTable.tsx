"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	DataTablePagination,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DateTime } from "luxon";
import {
	rescheduleDinners,
	updateDinner,
	type DinnerDate,
} from "../actions/dinners";
import { useEffect, useState } from "react";
import type { User } from "@/lib/db/schemas/users";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { EllipsisIcon, Trash2Icon } from "lucide-react";

declare module "@tanstack/react-table" {
	interface TableMeta<TData> {
		updateRow: (index: number, newRow: TData, oldRow: TData) => Promise<void>;
		users: User[];
	}
}

const columnHelper = createColumnHelper<DinnerDate>();

const columns = [
	columnHelper.accessor("dinner.date", {
		header: "Date",
		cell: ({ cell }) => {
			const date = DateTime.fromJSDate(cell.getValue());
			return date.toFormat("EEEE, dd LLL yyyy");
		},
	}),
	columnHelper.accessor("dinner.date", {
		id: "when",
		header: "When",
		cell: ({ cell }) => {
			const date = DateTime.fromJSDate(cell.getValue());
			if (Math.floor(date.diffNow("days").days) === 0) {
				return "Today";
			}

			if (date.diffNow("days").days < 7) {
				return `${Math.ceil(date.diffNow("days").days)} days left`;
			}
			return date.diffNow("weeks").toFormat("w 'weeks' 'left'");
		},
	}),
	columnHelper.accessor("headchef.name", {
		header: "Head Chef",
		cell(props) {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger className="cursor-pointer">
						{props.cell.getValue()}
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Change Head Chef</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{props.table.options.meta?.users
							.filter((u) => u.id !== props.row.original.headchef.id)
							.map((u) => (
								<DropdownMenuItem
									key={u.id}
									onClick={() => {
										props.table.options.meta?.updateRow(
											props.row.index,
											{
												...props.row.original,
												dinner: {
													...props.row.original.dinner,
													headchefId: u.id,
												},
												headchef: u,
											},
											props.row.original,
										);
									}}
								>
									{u.name}
								</DropdownMenuItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	}),
	columnHelper.accessor("souschef.name", {
		header: "Sous Chef",
		cell(props) {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger className="cursor-pointer">
						{props.cell.getValue()}
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Change Sous Chef</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{props.table.options.meta?.users
							.filter((u) => u.id !== props.row.original.souschef.id)
							.map((u) => (
								<DropdownMenuItem
									key={u.id}
									onClick={() => {
										props.table.options.meta?.updateRow(
											props.row.index,
											{
												...props.row.original,
												dinner: {
													...props.row.original.dinner,
													souschefId: u.id,
												},
												souschef: u,
											},
											props.row.original,
										);
									}}
								>
									{u.name}
								</DropdownMenuItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	}),
];

interface DataTableProps {
	data: DinnerDate[];
	users: User[];
}

export function DinnersTable({ data, users }: DataTableProps) {
	const [rows, setRows] = useState(data);
	useEffect(() => {
		setRows(data);
	}, [data]);
	const [loading, setLoading] = useState(false);
	const [openReschedule, setOpenReschedule] = useState(false);

	const table = useReactTable<DinnerDate>({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
		meta: {
			async updateRow(index, newRow) {
				const oldRows = rows;
				const newRows = rows.map((row, i) => (i === index ? newRow : row));
				setRows(newRows);
				setLoading(true);
				try {
					await updateDinner(newRow.dinner);
				} catch (error) {
					setRows(oldRows);
					if (error instanceof Error) {
						console.error(error.message);
					}
				}
				setLoading(false);
			},
			users,
		},
	});

	return (
		<>
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
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination
				table={table}
				pageSize={8}
				action={
					<DropdownMenu>
						<DropdownMenuTrigger className="cursor-pointer" asChild>
							<Button variant={"outline"} size={"icon"}>
								<EllipsisIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => setOpenReschedule(true)}
							>
								<Trash2Icon /> Reschedule dinners
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>
			<Dialog.Dialog open={openReschedule} onOpenChange={setOpenReschedule}>
				<Dialog.DialogContent>
					<Dialog.DialogHeader>
						<Dialog.DialogTitle>Reschedule dinners</Dialog.DialogTitle>
						<Dialog.DialogDescription asChild>
							<p>This will remove all dinners and add new dinners!</p>
						</Dialog.DialogDescription>
						<Dialog.DialogFooter>
							<Dialog.DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</Dialog.DialogClose>
							<Dialog.DialogClose asChild>
								<Button
									variant="destructive"
									onClick={async () => {
										try {
											await rescheduleDinners();
										} catch (error) {
											if (error instanceof Error) {
												console.error(error.message);
											}
										}
									}}
								>
									Reschedule
								</Button>
							</Dialog.DialogClose>
						</Dialog.DialogFooter>
					</Dialog.DialogHeader>
				</Dialog.DialogContent>
			</Dialog.Dialog>
			<div className="flex gap-4 items-center">
				<div className="flex-2" />
				{loading && <Spinner size={15} variant="ellipsis" />}
				<span className="text-sm text-neutral-600 self-end">
					Click on a chef to change them
				</span>
			</div>
		</>
	);
}
