import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import { PageTransition } from "./PageTransition";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Brinken Bot",
	description: "A Discord bot for Brinken",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-[geisha sans] antialiased`}
			>
				<main className="grid grid-cols-[1fr_2fr] items-center px-[20%] py-[10%] gap-4">
					<div className="flex flex-col gap-4 pr-4 self-start">
						<header className="w-100 mb-10">
							<h1 className="font-bold text-2xl">Brinken Bot</h1>
							<p>Hello and welcome to the bot</p>
						</header>
						<Navigation />
					</div>
					<PageTransition>
						<div className="flex justify-center items-center">{children}</div>
					</PageTransition>
				</main>
			</body>
		</html>
	);
}
