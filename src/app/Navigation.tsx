"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";

const variants: Variants = {
	hidden: { opacity: 0, x: -10 },
	visible: { opacity: 1, x: 0 },
};

export default function Navigation() {
	const path = usePathname();
	return (
		<>
			<nav className="lg:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="justify-self-end">
							<EllipsisIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<Link href="/" passHref>
							<DropdownMenuItem>Home</DropdownMenuItem>
						</Link>
						<Link href="/users" passHref>
							<DropdownMenuItem>Users</DropdownMenuItem>
						</Link>
						<Link href="/dinners" passHref>
							<DropdownMenuItem>Dinner dates</DropdownMenuItem>
						</Link>
						<Link href="/logs" passHref>
							<DropdownMenuItem>Logs</DropdownMenuItem>
						</Link>
						<Link href="/doodles" passHref>
							<DropdownMenuItem>Doodles</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>
			<nav className="place-self-center max-lg:hidden">
				<motion.ul
					className="flex gap-2 text-neutral-600 text-sm max-mb:flex-wrap"
					transition={{
						staggerChildren: 0.1,
					}}
					initial="hidden"
					animate="visible"
				>
					<motion.li variants={variants}>
						<ButtonLink variant="outline" active={path === "/"} href="/">
							Home
						</ButtonLink>
					</motion.li>
					<motion.li variants={variants}>
						<ButtonLink
							variant="outline"
							active={path === "/users"}
							href="/users"
						>
							Users
						</ButtonLink>
					</motion.li>
					<motion.li variants={variants}>
						<ButtonLink
							variant="outline"
							active={path === "/dinners"}
							href="/dinners"
						>
							Dinner dates
						</ButtonLink>
					</motion.li>
					<motion.li variants={variants}>
						<ButtonLink
							variant="outline"
							active={path === "/logs"}
							href="/logs"
						>
							Logs
						</ButtonLink>
					</motion.li>
					<motion.li variants={variants}>
						<ButtonLink
							variant="outline"
							active={path === "/doodles"}
							href="/doodles"
						>
							Doodles
						</ButtonLink>
					</motion.li>
				</motion.ul>
			</nav>
		</>
	);
}
