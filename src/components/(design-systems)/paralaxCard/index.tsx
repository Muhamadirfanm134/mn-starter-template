"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

interface ParallaxCardProps {
	children: React.ReactNode;
	bgImage?: string;
	className?: string;
}

export default function ParallaxCard({
	children,
	bgImage,
	className,
}: ParallaxCardProps) {
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setOffset(window.scrollY * 0.3); // speed parallax
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className={clsx("relative overflow-hidden rounded-3xl", className)}>
			{/* Background (Parallax) */}
			<div
				className="absolute inset-0 scale-110 bg-cover bg-center"
				style={{
					backgroundImage: `url(${bgImage})`,
					transform: `translateY(${offset}px)`,
				}}
			/>

			{/* Overlay (biar teks kebaca) */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

			{/* Content (Sheet Style) */}
			<div className="relative z-10 p-4">
				<div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
					{children}
				</div>
			</div>
		</div>
	);
}
