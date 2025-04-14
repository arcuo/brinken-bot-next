"use client";

import Image from "next/image";
import botImage from "../../public/brinken-bot.png";
import { PageTransitionWrapper } from "./PageTransition";

export default function Home() {
	return (
		<PageTransitionWrapper>
			<Image
				alt="Brinken Bot Hello"
				src={botImage}
				className="size-[500px] rounded-2xl object-cover shadow-lg shadow-black/30"
			/>
		</PageTransitionWrapper>
	);
}
