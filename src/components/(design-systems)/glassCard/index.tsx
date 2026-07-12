import clsx from "clsx";
import type React from "react";

interface GlassCardProps {
	children: React.ReactNode;
	className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
	return (
		<div
			className={clsx(
				"relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl",
				className,
			)}
		>
			{/* Glow effect */}
			<div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

			{/* Content */}
			<div className="relative z-10 p-4">{children}</div>
		</div>
	);
}
