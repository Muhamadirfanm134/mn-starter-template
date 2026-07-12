export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		if (navigator?.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		} else {
			// Fallback untuk browser lama
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed"; // agar tidak scroll
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();

			const success = document.execCommand("copy");
			document.body.removeChild(textarea);
			return success;
		}
	} catch (err) {
		console.error("Copy failed:", err);
		return false;
	}
}
