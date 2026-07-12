"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
	onBack?: () => void;
	backHref?: string;
	className?: string;
}

export default function MobileHeader({
	title,
	subtitle,
	action,
	onBack,
	backHref,
	className,
}: MobileHeaderProps) {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) onBack();
		else if (backHref) router.push(backHref);
		else router.back();
	};

	return (
		<div
			className={cn(
				"sticky top-0 z-40 -mx-4 border-b border-gray-100 bg-white/80 px-4 pt-10 pb-4 backdrop-blur-xl md:-mx-8 md:px-8",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={handleBack}
					className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
					aria-label="Back"
				>
					<ChevronLeft size={20} />
				</button>
				<div className="flex-1 overflow-hidden">
					<h1 className="truncate bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-black text-transparent">
						{title}
						<span className="text-primary-600">.</span>
					</h1>
					{subtitle && (
						<p className="mt-1 truncate text-xs font-medium text-gray-400">
							{subtitle}
						</p>
					)}
				</div>
				{action && <div className="shrink-0">{action}</div>}
			</div>
		</div>
	);
}
