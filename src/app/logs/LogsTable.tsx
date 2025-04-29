"use client";

import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	DataTablePagination,
	Table,
	TableBody,
	TableHeader,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import {
	ArrowDownFromLine,
	EllipsisIcon,
	EyeIcon,
	MessageCircleIcon,
	MessageCircleWarningIcon,
	Trash2Icon,
} from "lucide-react";
import type { logs } from "@/lib/db/schemas/logs";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import * as Dialog from "@/components/ui/dialog";
import { clearLogs, reloadLogs } from "../actions/logs";

type Log = typeof logs.$inferSelect;

const columnHelper = createColumnHelper<Log>();

const columns = [
	columnHelper.accessor("logType", {
		header: "Type",
		cell: ({ cell }) => {
			return cell.getValue() === "error" ? (
				<MessageCircleWarningIcon className="size-5 text-red-500" />
			) : (
				<MessageCircleIcon className="size-5" />
			);
		},
	}),
	columnHelper.accessor("message", {
		header: "Message",
		cell: ({ cell }) => {
			return cell.getValue();
		},
	}),
	columnHelper.accessor("data", {
		header: "Data",
		cell: ({ row, cell }) => {
			const data = cell.getValue();
			return (
				<div className="text-center">
					{data ? (
						<Link href={`/logs/${row.original.id}`} target="_blank">
							<Button size="icon" className="size-7" variant="outline">
								<EyeIcon />
							</Button>
						</Link>
					) : (
						""
					)}
				</div>
			);
		},
	}),
	columnHelper.accessor("createdAt", {
		header: "Created At",
		cell: ({ cell }) => {
			const date = DateTime.fromJSDate(cell.getValue());
			return date.toFormat("F");
		},
	}),
];

interface DataTableProps {
	data: Log[];
}

export function LogsTable({ data }: DataTableProps) {
	const [rows, setRows] = useState(data);
	useEffect(() => {
		setRows(data);
	}, [data]);

	const table = useReactTable<Log>({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
	});

	const [openClearTable, setOpenClearTable] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<Table>
				<TableHeader table={table} />
				<TableBody table={table} />
			</Table>
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
								onClick={() => setOpenClearTable(true)}
							>
								<Trash2Icon /> Clear logs
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => reloadLogs()}>
								Reload logs <ArrowDownFromLine />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>
			<Dialog.Dialog open={openClearTable} onOpenChange={setOpenClearTable}>
				<Dialog.DialogContent>
					<Dialog.DialogHeader>
						<Dialog.DialogTitle>Clear logs</Dialog.DialogTitle>
						<Dialog.DialogDescription asChild>
							<p>This will delete all the logs</p>
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
											await clearLogs();
										} catch (error) {
											if (error instanceof Error) {
												console.error(error.message);
											}
										}
									}}
								>
									Clear logs
								</Button>
							</Dialog.DialogClose>
						</Dialog.DialogFooter>
					</Dialog.DialogHeader>
				</Dialog.DialogContent>
			</Dialog.Dialog>
		</div>
	);
}
