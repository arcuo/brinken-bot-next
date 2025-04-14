"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Variants } from "motion/react";
import type { HTMLAttributes } from "react";

export const variants: Variants = {
	hidden: { opacity: 0, x: -10 },
	visible: { opacity: 1, x: 0 },
};

export function PageTransition({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AnimatePresence mode="popLayout">{children}</AnimatePresence>;
}

export function PageTransitionWrapper({
	children,
	...props
}: {
	children: React.ReactNode;
} & Parameters<typeof motion.div>[0]) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={variants}
			exit="hidden"
			{...props}
		>
			{children}
		</motion.div>
	);
}
