/**
 * Removes duplicate objects from an array based on a specific key.
 * @param array - The array of objects.
 * @param key - The key to check for uniqueness.
 * @returns A new array with duplicates removed.
 */
export function removeDuplicatesByKey<T>(array: T[], key: keyof T): T[] {
	const seen = new Set<unknown>();
	return array.filter((item) => {
		const keyValue = item[key];
		if (seen.has(keyValue)) {
			return false;
		}
		seen.add(keyValue);
		return true;
	});
}

export const scrolltoId = (element_id: string, offset: number = 100) => {
	const element = document.getElementById(element_id);
	if (element) {
		const elementPosition =
			element.getBoundingClientRect().top + window.pageYOffset;
		const offsetPosition = elementPosition - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	}
};
