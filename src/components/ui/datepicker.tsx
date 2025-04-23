"use client";

import {
	DateField,
	DateInput,
	DateSegment,
	Label,
} from "react-aria-components";
import { inputStyle } from "./input";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { parseDate } from "@internationalized/date";
import { useMemo } from "react";
import { DateTime } from "luxon";

export function DatePicker({
	date,
	onDateChange,
}: { date?: Date; onDateChange: (date: Date | undefined) => void }) {
	const dateValue = useMemo(() => {
		try {
			return date
				? parseDate(DateTime.fromJSDate(date).toISODate() ?? "invalid")
				: undefined;
		} catch (error) {
			console.error("Invalid date format", error);
		}
	}, [date]);
	return (
		<DateField
			value={dateValue}
			onChange={(value) => {
				if (value) {
					onDateChange(new Date(value.toString()));
				} else {
					onDateChange(undefined);
				}
			}}
			className={cn(inputStyle, "items-center gap-2")}
		>
			<VisuallyHidden>
				<Label className="font-medium text-muted-foreground text-sm">
					Date
				</Label>
			</VisuallyHidden>
			<DateInput>
				{(segment) => {
					return (
						<DateSegment
							segment={segment}
							className="inline rounded p-0.5 text-foreground caret-transparent outline-0 data-[invalid]:data-[focused]:bg-destructive data-[focused]:data-[placeholder]:text-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[type=literal]:px-0 data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
						/>
					);
				}}
			</DateInput>
			<div className="flex-2" />
			{/* <Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" className="size-7">
						<CalendarIcon className="size-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={date} onSelect={onDateChange} />
				</PopoverContent>
			</Popover> */}
		</DateField>
	);
}
