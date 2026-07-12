"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "../button/Button";

interface EmptyStateProps {
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	actionHref?: string;
	className?: string;
	imageSize?: number;
}

export function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
	actionHref,
	className,
	imageSize = 200,
}: EmptyStateProps) {
	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={cn(
				"flex flex-col items-center justify-center px-6 py-12 text-center",
				className,
			)}
		>
			<div
				className="relative mb-6"
				style={{ width: imageSize, height: imageSize }}
			>
				<Image
					src="/empty.png"
					alt="Empty state"
					fill
					className="object-contain"
					priority
				/>
			</div>
			<h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
			{description && (
				<p className="mb-8 max-w-xs text-sm leading-relaxed text-gray-400">
					{description}
				</p>
			)}
			{actionLabel && (onAction || actionHref) && (
				<Button
					onClick={onAction}
					href={actionHref}
					variant="primary"
					radius="full"
					size="lg"
					className="shadow-primary-100 px-8 shadow-lg"
				>
					{actionLabel}
				</Button>
			)}
		</m.div>
	);
}
