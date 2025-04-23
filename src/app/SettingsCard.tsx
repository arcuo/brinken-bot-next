"use client";

import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@/components/ui/dialog";
import { setSetting, type getAllSettings } from "./actions/settings";
import {
	getSettingDescription,
	getSettingName,
	type SettingId,
} from "@/lib/db/schemas/settings";
import type { APIChannel } from "discord.js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SettingsCard({
	settings,
	channels,
}: {
	settings: Awaited<ReturnType<typeof getAllSettings>>;
	channels: APIChannel[];
}) {
	const [open, setOpen] = useState(false);

	async function onSetChannel(settingId: SettingId, discordChannelId: string) {
		const ch = channels.find((ch) => ch.id === discordChannelId);
		if (!ch) {
			console.error("Channel not found");
			return;
		}
		await setSetting(settingId, {
			channelName: ch.name!,
			discordChannelId,
		});
	}

	return (
		<>
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>{"Settings"}</Card.CardTitle>
					<Card.CardDescription>{"Settings for the bot"}</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
					{Object.entries(settings).map(([settingId, value]) => (
						<div key={settingId}>
							<span className="font-bold">
								{getSettingName(settingId as SettingId)}
							</span>{" "}
							<span className="text-neutral-600">
								{value?.channelName ?? "Not set"}
							</span>
						</div>
					))}
					{/* TODO: Add settings for weekly dinner day */}
					{/* <div>
						<span className="font-bold">Weekly dinner day -</span>{" "}
						<span className="text-neutral-600">Wednesday</span>
					</div> */}
				</Card.CardContent>
				<Card.CardFooter>
					<Button onClick={() => setOpen(true)} variant="outline">
						Update settings <SettingsIcon />{" "}
					</Button>
				</Card.CardFooter>
			</Card.Card>
			<Dialog.Dialog open={open} onOpenChange={setOpen}>
				<Dialog.DialogContent>
					<Dialog.DialogHeader>
						<Dialog.DialogTitle>Settings</Dialog.DialogTitle>
						<Dialog.DialogDescription asChild>
							<p>Settings for the bot</p>
						</Dialog.DialogDescription>
					</Dialog.DialogHeader>

					<div className="flex flex-col gap-2 text-sm">
						{Object.entries(settings).map(([settingId, value]) => (
							<div
								className="flex items-start justify-between gap-2"
								key={settingId}
							>
								<div className="flex flex-col gap-1">
									<span className="font-bold">
										{getSettingName(settingId as SettingId)}
									</span>{" "}
									<span className="text-neutral-600 text-xs">
										{getSettingDescription(settingId as SettingId)}
									</span>
								</div>
								<Select
									value={value?.discordChannelId}
									onValueChange={(value) =>
										onSetChannel(settingId as SettingId, value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a channel" />
									</SelectTrigger>
									<SelectContent>
										{channels.map((ch) => (
											<SelectItem key={ch.id} value={ch.id}>
												# {ch.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
					</div>

					<Dialog.DialogFooter>
						<Dialog.DialogClose asChild>
							<Button variant="secondary">Close</Button>
						</Dialog.DialogClose>
					</Dialog.DialogFooter>
				</Dialog.DialogContent>
			</Dialog.Dialog>
		</>
	);
}
