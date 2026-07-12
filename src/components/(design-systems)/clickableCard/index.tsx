"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ClickableCardProps = {
	children: React.ReactNode;
	color?: "primary" | "green" | "blue" | "yellow" | "red";
	className?: string;
	onClick?: () => void;
	href?: string; // 👈 tambahan
};

const colorMap = {
	primary: "bg-primary-500",
	green: "bg-green-500",
	blue: "bg-blue-500",
	yellow: "bg-yellow-500",
	red: "bg-red-500",
};

export default function ClickableCard({
	children,
	color,
	className,
	onClick,
	href,
}: ClickableCardProps) {
	const hasColor = !!color;

	const baseClass = cn(
		"group relative overflow-hidden rounded-2xl border border-neutral-300 p-4",
		"transition-transform duration-150 ease-out",
		"active:scale-95",
		hasColor ? "cursor-pointer" : "hover:shadow-md",
		className,
	);

	const content = (
		<>
			{hasColor && (
				<div
					className={cn(
						"absolute bottom-0 left-0 z-0 h-0 w-0 -translate-x-1/2 translate-y-1/2 rounded-full",
						"transition-all duration-500 ease-out",
						"group-hover:h-[300%] group-hover:w-[300%]",
						"group-active:h-[300%] group-active:w-[300%]",
						colorMap[color],
					)}
				/>
			)}

			<div
				className={cn(
					"relative z-10 space-y-2 transition-colors duration-300",
					hasColor && "group-hover:text-white group-active:text-white",
				)}
			>
				{children}
			</div>
		</>
	);

	// 👇 kalau ada href → jadi Link
	if (href) {
		return (
			<Link href={href} className={baseClass}>
				{content}
			</Link>
		);
	}

	// 👇 fallback button/div
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(baseClass, "w-full text-left")}
		>
			{content}
		</button>
	);
}
