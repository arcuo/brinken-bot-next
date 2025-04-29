import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import { PageTransition } from "./PageTransition";
import { ClerkProvider, SignOutButton, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

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
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} relative grid h-screen w-screen grid-rows-[auto_1fr] antialiased`}
				>
					<header className="grid w-full max-w-full grid-cols-2 items-center justify-center gap-2 overflow-x-auto px-10 py-5 lg:grid-cols-3">
						<Link href="/">
							<div>
								<h1 className="font-bold text-2xl">Brinken Bot</h1>
								<p>Hello and welcome to the bot</p>
							</div>
						</Link>
						<div className="max-lg:flex max-lg:flex-col max-lg:items-end max-lg:gap-2 max-lg:place-self-end lg:contents">
							<Navigation />
							<SignedIn>
								<SignOutButton>
									<Button variant="outline" className="justify-self-end">
										<LogOutIcon />{" "}
										<span className="hidden md:block">Sign out</span>
									</Button>
								</SignOutButton>
							</SignedIn>
						</div>
					</header>
					<main className="max-w-full overflow-x-auto px-8 py-10 lg:px-[20%] lg:py-20">
						<PageTransition>{children}</PageTransition>
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
