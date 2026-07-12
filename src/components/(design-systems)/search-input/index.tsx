"use client";

import { ScanLine, Search } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onScan?: () => void;
	placeholder?: string;
	className?: string;
}

export default function SearchInput({
	value,
	onChange,
	onScan,
	placeholder = "Cari...",
	className,
}: SearchInputProps) {
	return (
		<div className={cn("relative flex-1", className)}>
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
				<Search className="h-4 w-4 text-gray-400" />
			</div>
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onChange(e.target.value)
				}
				className="h-[45px] w-full rounded-2xl border border-gray-200 bg-white pr-12 pl-10 text-sm shadow-sm transition-all outline-none focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
			/>
			{onScan && (
				<button
					type="button"
					onClick={onScan}
					className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 transition-colors hover:text-[var(--color-primary-600)]"
				>
					<ScanLine size={18} />
				</button>
			)}
		</div>
	);
}
