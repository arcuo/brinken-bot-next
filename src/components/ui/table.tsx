"use client";

import type * as React from "react";

import type { Table as TableTanstack } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	EllipsisIcon,
	Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import * as Dialog from "./dialog";
import { rescheduleDinners } from "@/app/actions/dinners";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn("[&_tr]:border-b", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
				className,
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"py-2 px-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("text-muted-foreground mt-4 text-sm", className)}
			{...props}
		/>
	);
}

interface DataTablePaginationProps<TData> {
	table: TableTanstack<TData>;
	pageSize?: number;
}

export function DataTablePagination<TData>({
	table,
	pageSize = 10,
}: DataTablePaginationProps<TData>) {
	useEffect(() => {
		table.setPageSize(pageSize);
	}, [table, pageSize]);

	const [openReschedule, setOpenReschedule] = useState(false);

	return (
		<div className="flex items-center justify-between px-2">
			<DropdownMenu>
				<DropdownMenuTrigger className="cursor-pointer">
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
			<div className="flex items-center space-x-6 lg:space-x-8">
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
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
