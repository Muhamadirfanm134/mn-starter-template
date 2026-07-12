import { useEffect, useState } from "react";

/**
 * Hook untuk mengetahui apakah komponen sudah mount di client.
 * Berguna untuk menghindari hydration mismatch saat SSR.
 */
export function useMounted() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted;
}
