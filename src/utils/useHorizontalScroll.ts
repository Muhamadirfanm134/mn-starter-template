import { useEffect, useRef } from "react";

export function useHorizontalScroll<T extends HTMLElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const onWheel = (e: WheelEvent) => {
			const rect = el.getBoundingClientRect();
			const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

			const atStart = el.scrollLeft <= 0;
			const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;

			const isScrollingHorizontally =
				isInView &&
				Math.abs(e.deltaY) > Math.abs(e.deltaX) &&
				!((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd));

			if (isScrollingHorizontally) {
				e.preventDefault();
				el.scrollLeft += e.deltaY;
			}
		};

		window.addEventListener("wheel", onWheel, { passive: false });

		return () => {
			window.removeEventListener("wheel", onWheel);
		};
	}, []);

	return ref;
}
