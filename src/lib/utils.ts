import { type ClassValue, clsx } from "clsx";
import { format } from "d3-format";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah
 * Example: 1500000 -> Rp 1.500.000
 */
export function formatRupiah(value: number | string): string {
	const number = Number(value);

	if (Number.isNaN(number)) return "Rp 0";

	const formatter = format(",.0f"); // thousand separator, no decimal

	return `Rp ${formatter(number).replace(/,/g, ".")}`;
}
