import clsx from "clsx";
import type { ReactNode } from "react";

type DetailItemProps = {
	label: ReactNode;
	value?: ReactNode;
	children?: ReactNode;
	className?: string;
	valueClassName?: string;
};

function isEmpty(value: ReactNode) {
	return value === "" || value === null || value === undefined;
}

export function DetailItem({
	label,
	value,
	children,
	className,
	valueClassName,
}: DetailItemProps) {
	const content = !isEmpty(children) ? children : !isEmpty(value) ? value : "-";

	return (
		<div className={clsx("flex justify-between gap-4", className)}>
			<div className="text-muted-foreground">{label}</div>

			<div className={clsx("text-right font-medium", valueClassName)}>
				{content}
			</div>
		</div>
	);
}
