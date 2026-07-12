// Define Tailwind's default breakpoints
export const tailwindBreakpoints: Record<string, number> = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
};

// Define valid breakpoint keys
export type TailwindBreakpoint = keyof typeof tailwindBreakpoints;

/**
 * Get the current Tailwind breakpoint based on window width.
 * @returns {TailwindBreakpoint | 'xs'} The current breakpoint or 'xs' if smaller than 'sm'.
 */
export function getCurrentBreakpoint(): TailwindBreakpoint | "xs" {
	const width = window.innerWidth;
	const entries = Object.entries(tailwindBreakpoints) as [
		TailwindBreakpoint,
		number,
	][];

	for (let i = entries.length - 1; i >= 0; i--) {
		const [key, value] = entries[i];
		if (width >= value) {
			return key;
		}
	}

	return "xs";
}

/**
 * Check if the current breakpoint is at least the given breakpoint.
 * @param breakpoint - One of Tailwind's defined breakpoints.
 * @returns {boolean} True if current screen width is equal or larger than the breakpoint.
 */
export function isBreakpointAtLeast(breakpoint: TailwindBreakpoint): boolean {
	const currentWidth = window.innerWidth;
	const targetWidth = tailwindBreakpoints[breakpoint];
	return currentWidth >= targetWidth;
}
