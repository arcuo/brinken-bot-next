"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, type Variants } from "motion/react";

const variants: Variants = {
	hidden: { opacity: 0, x: -10 },
	visible: { opacity: 1, x: 0 },
};

export default function Navigation() {
	return (
		<nav>
			<motion.ul
				className="flex flex-col gap-2 text-sm text-neutral-600 ml-5 marker:[content:_'>_']"
				transition={{
					staggerChildren: 0.1,
				}}
				initial="hidden"
				animate="visible"
			>
				<motion.li variants={variants}>
					<Link href="/">
						<Button variant="link">Actions</Button>
					</Link>
				</motion.li>
				<motion.li variants={variants}>
					<Link href="/users">
						<Button variant="link">Users</Button>
					</Link>
				</motion.li>
				<motion.li variants={variants}>
					<Link href="/dinners">
						<Button variant="link">Dinner dates</Button>
					</Link>
				</motion.li>
			</motion.ul>
		</nav>
	);
}
