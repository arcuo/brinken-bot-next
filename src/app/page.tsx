"use client";

import Image from "next/image";
import botImage from "../../public/brinken-bot.png";
import { PageTransitionWrapper } from "./PageTransition";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { CloudIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { handleDay } from "./actions/cron";
import { AnimatePresence, motion } from "motion/react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";

export default function Home() {
	return (
		<PageTransitionWrapper>
			<div className="flex gap-5">
				<Image
					alt="Brinken Bot Hello"
					src={botImage}
					className="size-[400px] rounded-2xl object-cover shadow-lg shadow-black/30"
				/>
				<div className="flex flex-col gap-2">
					<ActionCard
						title="Daily Check"
						description="Run the daily check for birthdays, dinners etc. Sends messages, creates birthday channels."
						action={async () => {
							try {
								await handleDay();
							} catch (error) {
								if (error instanceof Error)
									return { success: false, error: error.message };
								return { success: false, error: "Something went wrong" };
							}
							return { success: true };
						}}
					/>
				</div>
			</div>
		</PageTransitionWrapper>
	);
}

function ActionCard({
	action,
	description,
	title,
}: {
	title: string;
	description: string;
	action: () => Promise<{ success: true } | { success: false; error: string }>;
}) {
	const [loading, isLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	return (
		<Card.Card className="min-w-80">
			<Card.CardHeader>
				<Card.CardTitle>{title}</Card.CardTitle>
				<Card.CardDescription>{description}</Card.CardDescription>
			</Card.CardHeader>
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
							exit={{ x: -10, opacity: 0 }}
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="text-green-800 text-sm ml-2"
						>
							Success!
						</motion.div>
					)}

					{!error && (
						<motion.div
							exit={{ x: -10, opacity: 0 }}
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							className="text-green-800 text-sm ml-2"
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
