export function snakeCaseConverter(title: string): string {
	// Convert the string to lowercase
	const lowerCase = title.toLowerCase(); // Replace spaces with underscore
	const snakeCase = lowerCase.replace(/ /g, "_");
	return snakeCase;
}

/**
 * Truncates a string to a single line with optional max length and ellipsis.
 * @param text - The input string.
 * @param maxLength - Maximum number of characters to keep (default: 100).
 * @returns A single-line string with ellipsis if truncated.
 */
export function truncateToOneLine(
	text: string,
	maxLength: number = 100,
): string {
	const singleLine = text.replace(/\s+/g, " ").trim();
	return singleLine.length > maxLength
		? `${singleLine.slice(0, maxLength - 1).trimEnd()}…`
		: singleLine;
}

export function formatWithCommas(value: number | string): string {
	const number = typeof value === "string" ? parseFloat(value) : value;
	if (Number.isNaN(number)) return "Invalid number";
	return number.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
}

/**
 * Validates whether a given string is a properly formatted email address.
 * @param email - The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
	const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
