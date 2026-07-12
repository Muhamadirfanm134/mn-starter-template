"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface QuantityInputProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
	className?: string;
}

export function QuantityInput({
	value,
	onChange,
	min = 0,
	max,
	disabled = false,
	className,
}: QuantityInputProps) {
	const [localValue, setLocalValue] = useState(value.toString());

	// Sync local state when external value changes
	useEffect(() => {
		setLocalValue(value.toString());
	}, [value]);

	const handleIncrement = () => {
		if (max !== undefined && value >= max) return;
		onChange(value + 1);
	};

	const handleDecrement = () => {
		if (value > min) {
			onChange(value - 1);
		}
	};

	const handleInputBlur = () => {
		const val = parseInt(localValue, 10);
		if (!Number.isNaN(val)) {
			let finalVal = val;
			if (min !== undefined) finalVal = Math.max(min, finalVal);
			if (max !== undefined) finalVal = Math.min(max, finalVal);
			onChange(finalVal);
			setLocalValue(finalVal.toString());
		} else {
			setLocalValue(value.toString());
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	return (
		<div
			className={cn(
				"flex items-center rounded-2xl border border-gray-100 bg-gray-50 p-1 shadow-inner",
				className,
			)}
		>
			<button
				type="button"
				onClick={handleDecrement}
				disabled={disabled || value <= min}
				className="flex h-8 w-8 items-center justify-center rounded-xl border border-transparent bg-white text-gray-500 shadow-sm transition-all hover:border-red-100 hover:text-red-500 active:scale-95 disabled:opacity-50"
			>
				<Minus size={14} strokeWidth={2.5} />
			</button>
			<input
				type="number"
				inputMode="numeric"
				value={localValue}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
				disabled={disabled}
				className="h-8 w-12 [appearance:textfield] border-none bg-transparent p-0 text-center text-sm font-black text-gray-900 outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:text-gray-400"
			/>
			<button
				type="button"
				onClick={handleIncrement}
				disabled={disabled || (max !== undefined && value >= max)}
				className="hover:text-primary-500 hover:border-primary-100 flex h-8 w-8 items-center justify-center rounded-xl border border-transparent bg-white text-gray-500 shadow-sm transition-all active:scale-95 disabled:opacity-50"
			>
				<Plus size={14} strokeWidth={2.5} />
			</button>
		</div>
	);
}
