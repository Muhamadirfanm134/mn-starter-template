"use client";

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

const variantStyles: Record<ToastVariant, string> = {
	default: "bg-slate-700/90 border-slate-600 text-white",
	success: "bg-green-700 text-white border-green-600",
	error: "bg-red-700 text-white border-red-600",
	warning: "bg-amber-700 text-white border-amber-600",
	info: "bg-blue-700 text-white border-blue-600",
};

const iconBgStyles: Record<ToastVariant, string> = {
	default: "bg-slate-600",
	success: "bg-green-600",
	error: "bg-red-600",
	warning: "bg-amber-600",
	info: "bg-blue-600",
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
	default: null,
	success: <CheckCircle2 className="h-5 w-5 shrink-0" />,
	error: <XCircle className="h-5 w-5 shrink-0" />,
	warning: <AlertTriangle className="h-5 w-5 shrink-0" />,
	info: <Info className="h-5 w-5 shrink-0" />,
};

export type ToastProps = {
	id: string;
	title?: string;
	description?: string;
	variant?: ToastVariant;
	onClose: (id: string) => void;
};

export default function Toast({
	id,
	title,
	description,
	variant = "default",
	onClose,
}: ToastProps) {
	const hasDescription = !!description;

	return (
		<div
			role="status"
			aria-live="polite"
			className={cn(
				"pointer-events-auto mb-3 flex w-[calc(100vw-32px)] items-start justify-between border p-3 shadow-lg backdrop-blur-sm transition-all sm:max-w-lg",
				hasDescription ? "rounded-2xl" : "items-center rounded-full",
				variantStyles[variant],
			)}
		>
			<div
				className={cn(
					"flex items-start gap-3",
					!hasDescription && "items-center",
				)}
			>
				{variant !== "default" && (
					<div
						className={cn(
							"flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
							iconBgStyles[variant],
							!hasDescription && "h-7 w-7",
						)}
					>
						{variantIcon[variant]}
					</div>
				)}
				<div
					className={cn("flex flex-col", !hasDescription && "justify-center")}
				>
					{title && (
						<span
							className={cn(
								"text-sm leading-tight font-bold",
								!hasDescription && "text-xs",
							)}
						>
							{title}
						</span>
					)}
					{description && (
						<span className="mt-1 text-xs leading-relaxed opacity-90">
							{description}
						</span>
					)}
				</div>
			</div>

			<button
				type="button"
				aria-label="Close"
				onClick={() => onClose(id)}
				className={cn(
					"ml-4 shrink-0 rounded-full border border-white/20 p-1 transition-colors hover:bg-white/10",
					!hasDescription && "p-0.5",
				)}
			>
				<X
					className={cn("h-4 w-4 opacity-70", !hasDescription && "h-3.5 w-3.5")}
				/>
			</button>
		</div>
	);
}
