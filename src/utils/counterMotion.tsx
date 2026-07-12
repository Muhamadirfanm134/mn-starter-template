"use client";

import {
	animate,
	m,
	useInView,
	useMotionValue,
	useTransform,
} from "framer-motion";
import type React from "react";
import { useEffect, useRef } from "react";

interface CounterProps {
	from: number;
	to: number;
	duration?: number;
	format?: (value: number) => string;
}

const MotionCounter: React.FC<CounterProps> = ({
	from,
	to,
	duration = 2,
	format = (value) => value.toFixed(0),
}) => {
	const count = useMotionValue(from);
	const rounded = useTransform(count, (latest) => format(latest));

	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { amount: 0.5 }); // triggers when 50% visible

	useEffect(() => {
		if (isInView) {
			count.set(from);
			const controls = animate(count, to, {
				duration,
			});
			return () => controls.stop();
		}
	}, [isInView, count, from, to, duration]);

	return (
		<div ref={ref}>
			<m.p
				initial={{ opacity: 0, y: 20 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
			>
				{rounded}
			</m.p>
		</div>
	);
};

export default MotionCounter;
