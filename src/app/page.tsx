"use server";

import Image from "next/image";
import botImage from "../../public/brinken-bot.png";
import { PageTransitionWrapper } from "./PageTransition";
import { RunActionCard } from "./RunActionCard";
import { SettingsCard } from "./SettingsCard";
import { getAllSettings } from "./actions/settings";
import { getChannels } from "./actions/discord";

export default async function Home() {
	const [settings, channels] = await Promise.all([
		getAllSettings(),
		getChannels(),
	]);

	return (
		<PageTransitionWrapper className="flex w-full items-center justify-center gap-5 max-lg:flex-col">
			<Image
				alt="Brinken Bot Hello"
				src={botImage}
				className="rounded-2xl object-cover object-center shadow-black/30 shadow-lg lg:size-[400px]"
			/>
			<div className="flex max-w-full flex-col gap-2">
				<RunActionCard />
				<SettingsCard settings={settings} channels={channels} />
			</div>
		</PageTransitionWrapper>
	);
}
