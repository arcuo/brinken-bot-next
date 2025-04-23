"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, EllipsisIcon } from "lucide-react";

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
					<DropdownMenuTrigger>
						<Button variant="outline" className="justify-self-end">
							<EllipsisIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<Link href="/">
							<DropdownMenuItem>Home</DropdownMenuItem>
						</Link>
						<Link href="/users">
							<DropdownMenuItem>Users</DropdownMenuItem>
						</Link>
						<Link href="/dinners">
							<DropdownMenuItem>Dinner dates</DropdownMenuItem>
						</Link>
						<Link href="/logs">
							<DropdownMenuItem>Logs</DropdownMenuItem>
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
						<Link href="/">
							<Button variant="outline" active={path === "/"}>
								Home
							</Button>
						</Link>
					</motion.li>
					<motion.li variants={variants}>
						<Link href="/users">
							<Button variant="outline" active={path === "/users"}>
								Users
							</Button>
						</Link>
					</motion.li>
					<motion.li variants={variants}>
						<Link href="/dinners">
							<Button variant="outline" active={path === "/dinners"}>
								Dinner dates
							</Button>
						</Link>
					</motion.li>
					<motion.li variants={variants}>
						<Link href="/logs">
							<Button variant="outline" active={path === "/logs"}>
								Logs
							</Button>
						</Link>
					</motion.li>
				</motion.ul>
			</nav>
		</>
	);
}
