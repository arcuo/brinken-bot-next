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

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	nickname: z.string().optional(),
	birthday: z.date(),
	phone: z.string().optional(),
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
			...user,
			phone: user?.phone || "",
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
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder="12345678" {...field} />
							</FormControl>
							<FormDescription>
								Optional phone number of the user
							</FormDescription>
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
							<FormDescription>Discord ID of the user</FormDescription>
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
