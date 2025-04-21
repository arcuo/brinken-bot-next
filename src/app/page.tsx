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
		<PageTransitionWrapper>
			<div className="flex gap-5">
				<Image
					alt="Brinken Bot Hello"
					src={botImage}
					className="size-[400px] rounded-2xl object-cover shadow-lg shadow-black/30"
				/>
				<div className="flex flex-col gap-2">
					<RunActionCard />
					<SettingsCard settings={settings} channels={channels} />
				</div>
			</div>
		</PageTransitionWrapper>
	);
}
