"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { addUser } from "../actions/users";
import type { users } from "@/lib/db/schemas/users";
import * as Popover from "@/components/ui/popover";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	nickname: z.string().optional(),
	birthday: z.date(),
	discordId: z.string().min(1, "Discord ID is required"),
});

export function AddUserForm({
	user,
	onSubmit,
	submitText = "Add User",
}: {
	onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
	user?: Partial<typeof users.$inferInsert>;
	submitText?: string;
}) {
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		try {
			await onSubmit(values);
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setLoading(false);
		}
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			discordId: "",
			...user,
			nickname: user?.nickname || "",
			birthday: user?.birthday ? new Date(user.birthday) : undefined,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name*</FormLabel>
							<FormControl>
								<Input placeholder="Lars Lilholt" {...field} />
							</FormControl>
							<FormDescription>Name of the user</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="nickname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nick Name</FormLabel>
							<FormControl>
								<Input placeholder="Lillemanden" {...field} />
							</FormControl>
							<FormDescription>Optional nick name of the user</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="birthday"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Birthday*</FormLabel>
							<FormControl>
								<DatePicker
									date={field.value}
									onDateChange={(date) => {
										field.onChange(date);
									}}
								/>
							</FormControl>
							<FormDescription>Birthday of the user</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="discordId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Discord ID*</FormLabel>
							<FormControl>
								<Input placeholder="123456789012345678" {...field} />
							</FormControl>
							<FormDescription>
								Discord ID of the user{" "}
								<Popover.Popover>
									<Popover.PopoverTrigger asChild>
										<Button
											className="size-3 self-center p-2 text-xs"
											variant="outline"
										>
											?
										</Button>
									</Popover.PopoverTrigger>
									<Popover.PopoverContent className="flex w-fit max-w-90 flex-col gap-2 p-2 text-sm">
										<p>
											To get the discord ID (
											<a
												target="_blank"
												className="text-blue-500 visited:text-blue-800 hover:underline"
												href="https://support.playhive.com/discord-user-id/"
												rel="noreferrer"
											>
												Guide
											</a>
											)
										</p>
										<ul className="ml-6 list-disc">
											<li>
												On Discord, go to <code>Settings {">"} Advanced</code>
											</li>
											<li>
												Scroll down and make sure that Developer Mode is on
											</li>
											<li>Right click on your account and click Copy ID</li>
										</ul>
									</Popover.PopoverContent>
								</Popover.Popover>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={!form.formState.isValid}>
					{loading ? "Loading..." : submitText}
				</Button>
			</form>
		</Form>
	);
}

export function AddUserDialog() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await addUser({ ...values });
			setOpen(false);
		} catch (error) {
			console.log("error:", error);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
			}}
		>
			<DialogTrigger asChild>
				<Button variant="outline">Add user</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add user</DialogTitle>
					<DialogDescription>
						Add a new user to the database. This will be used to keep track of
						people, update on birthdays and dinner dates!
					</DialogDescription>
				</DialogHeader>
				<AddUserForm onSubmit={onSubmit} />
			</DialogContent>
		</Dialog>
	);
}
