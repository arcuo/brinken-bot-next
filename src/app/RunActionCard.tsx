"use client";

import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { CloudIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { handleDay } from "./actions/cron";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function RunActionCard() {
	const [loading, isLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [birthdays, setBirthdays] = useState(true);
	const [dinners, setDinners] = useState(true);
	const [houseMeeting, setHouseMeeting] = useState(true);

	const action = async () => {
		try {
			await handleDay();
		} catch (error) {
			if (error instanceof Error)
				return { success: false, error: error.message };
			return { success: false, error: "Something went wrong" };
		}
		return { success: true };
	};
	return (
		<Card.Card className="max-w-full">
			<Card.CardHeader>
				<Card.CardTitle>Daily Check</Card.CardTitle>
				<Card.CardDescription>
					Run the daily check for birthdays, dinners etc. Sends messages,
					creates birthday channels.
				</Card.CardDescription>
			</Card.CardHeader>
			<Card.CardContent className="flex gap-5 [&>div>label]:text-xs [&>div]:flex [&>div]:gap-2">
				<div>
					<Label htmlFor="birthdays-checkbox">Run for birthdays</Label>
					<Checkbox
						id="birthdays-checkbox"
						checked={birthdays}
						onCheckedChange={(value) => setBirthdays(!!value)}
					/>
				</div>
				<div>
					<Label htmlFor="dinners-checkbox">Run for dinners</Label>
					<Checkbox
						id="dinners-checkbox"
						checked={dinners}
						onCheckedChange={(value) => setDinners(!!value)}
					/>
				</div>
				<div>
					<Label htmlFor="house-meeting-checkbox">Run for house meeting</Label>
					<Checkbox
						id="house-meeting-checkbox"
						checked={houseMeeting}
						onCheckedChange={(value) => setHouseMeeting(!!value)}
					/>
				</div>
			</Card.CardContent>
			<Card.CardFooter>
				<Button
					onClick={async () => {
						isLoading(true);
						setSuccess(false);
						setError("");
						try {
							const result = await action();
							if (result.success) {
								setSuccess(true);
								setTimeout(() => setSuccess(false), 2000);
							} else {
								throw new Error(result.error);
							}
						} catch (error) {
							if (error instanceof Error) setError(error.message);
						} finally {
							isLoading(false);
						}
					}}
					disabled={loading}
					variant={success ? "positive" : error ? "destructive" : undefined}
				>
					Run
					{loading ? <Spinner variant="default" /> : <CloudIcon />}
				</Button>
				<AnimatePresence>
					{success && (
						<motion.div
							key="success"
							exit={{ x: -10, opacity: 0 }}
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="ml-2 text-green-800 text-sm"
						>
							Success!
						</motion.div>
					)}

					{!error && (
						<motion.div
							key="error"
							exit={{ x: -10, opacity: 0 }}
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="ml-2 text-green-800 text-sm"
						>
							<Tooltip>
								<TooltipTrigger asChild>Something went wrong</TooltipTrigger>
								<TooltipContent>error</TooltipContent>
							</Tooltip>
						</motion.div>
					)}
				</AnimatePresence>
			</Card.CardFooter>
		</Card.Card>
	);
}
