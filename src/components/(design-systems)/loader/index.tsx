import { Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
	variant?: "primary" | "white" | "gray";
	fullPage?: boolean;
	text?: string;
}

export default function Loader({
	className,
	size = "md",
	variant = "primary",
	fullPage = false,
	text,
}: LoaderProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const sizes = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
		xl: "w-16 h-16",
	};

	const variants = {
		primary: "text-primary-600",
		white: "text-white",
		gray: "text-gray-300",
	};

	if (!mounted) return null;

	const content = (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4",
				className,
			)}
		>
			<div className="relative">
				{/* Decorative background pulse */}
				<div
					className={cn(
						"absolute inset-0 animate-ping rounded-full opacity-20",
						variant === "primary" ? "bg-primary-500" : "bg-white",
					)}
				/>

				{/* The Spinner */}
				<Loader2
					className={cn(
						"relative z-10 animate-spin",
						sizes[size],
						variants[variant],
					)}
				/>

				{/* Subtle Brand Icon in the middle (only for larger sizes) */}
				{(size === "lg" || size === "xl") && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Package
							size={size === "lg" ? 16 : 24}
							className={cn("opacity-40", variants[variant])}
						/>
					</div>
				)}
			</div>

			{text && (
				<p
					className={cn(
						"animate-pulse text-sm font-bold tracking-wide",
						variant === "primary" ? "text-primary-600" : "text-white",
					)}
				>
					{text}
				</p>
			)}
		</div>
	);

	if (fullPage) {
		return (
			<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
				{content}
			</div>
		);
	}

	return (
		<div className="flex h-64 w-full items-center justify-center">
			{content}
		</div>
	);
}
