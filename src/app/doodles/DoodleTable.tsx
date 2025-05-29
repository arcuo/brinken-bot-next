"use client";

import {
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableHeader } from "@/components/ui/table";

import type { Doodle } from "@/lib/db/schemas/doodles";
import { DateTime } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DeleteDoodleDialog } from "./DeleteDoodleDialog";

const columnHelper = createColumnHelper<Doodle>();

const columns = [
	columnHelper.accessor("title", {
		header: "Title",
	}),
	columnHelper.accessor("description", {
		header: "Description",
	}),
	columnHelper.accessor("deadline", {
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
							Deadline
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
						<p>Sorting by the deadline of the doodle.</p>
					</TooltipContent>
				</Tooltip>
			);
		},
		cell({ row }) {
			const deadline = row.getValue<Date>("deadline");
			return deadline
				? DateTime.fromJSDate(deadline).toFormat("dd LLL yyyy HH:mm")
				: "N/A";
		},
	}),
	columnHelper.accessor("link", {
		header: "Link",
		cell({ row }) {
			const link = row.getValue<string>("link");
			return (
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{link}
				</a>
			);
		},
	}),
	columnHelper.accessor("level", {
		header: "Level",
	}),
	columnHelper.accessor("lastMessage", {
		header: "Last Message",
		cell({ row }) {
			const lastMessage = row.getValue<Date>("lastMessage");
			return lastMessage
				? DateTime.fromJSDate(lastMessage).toFormat("dd LLL yyyy HH:mm")
				: "N/A";
		},
	}),
	columnHelper.display({
		id: "actions",
		header: "Actions",
		meta: {
			headerProps: { className: cn("text-right") },
		},
		cell({ row }) {
			const doodle = row.original;
			return (
				<div className="flex justify-end gap-2">
					<DeleteDoodleDialog doodleId={doodle.id} doodleTitle={doodle.title} />
				</div>
			);
		},
	}),
];

interface DataTableProps {
	data: Doodle[];
}

export function DoodleTable({ data }: DataTableProps) {
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
