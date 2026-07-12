import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollMotionOptions {
	direction?: "up" | "down" | "left" | "right";
	delay?: number;
	duration?: number;
	distance?: number;
	opacity?: number;
	once?: boolean;
	threshold?: number;
	mobileThreshold?: number;
	mobileDistance?: number;
	mobileDelay?: number;
}

export function useScrollMotionProps({
	direction = "up",
	delay = 0,
	duration = 0.5,
	distance = 20,
	opacity = 0,
	once = true,
	threshold = 0.5,
	mobileThreshold = 0.2,
	mobileDistance,
	mobileDelay,
}: ScrollMotionOptions = {}) {
	const ref = useRef(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const finalThreshold = isMobile ? mobileThreshold : threshold;
	const finalDistance =
		isMobile && mobileDistance !== undefined ? mobileDistance : distance;
	const finalDelay =
		isMobile && mobileDelay !== undefined ? mobileDelay : delay;

	const isInView = useInView(ref, {
		once: isMobile || once,
		amount: finalThreshold,
	});

	let x = 0;
	let y = 0;

	switch (direction) {
		case "up":
			y = finalDistance;
			break;
		case "down":
			y = -finalDistance;
			break;
		case "left":
			x = finalDistance;
			break;
		case "right":
			x = -finalDistance;
			break;
	}

	return {
		ref,
		motionProps: {
			initial: { opacity, x, y },
			animate: isInView ? { opacity: 1, x: 0, y: 0 } : { opacity, x, y },
			transition: { delay: finalDelay, duration, ease: "easeOut" },
		},
	};
}
