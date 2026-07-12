import clsx from "clsx";
import type React from "react";

interface EmptyStateProps {
	title?: string;
	titleStyle?: string;
	description?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	title = "No Data Available",
	titleStyle,
	description = "There is currently no data to display.",
	icon,
	children,
}) => {
	return (
		<div className="flex flex-col justify-center px-4 py-16 text-center text-gray-500">
			{icon && (
				<div className="mb-4 flex flex-col items-center text-4xl text-gray-400">
					{icon}
				</div>
			)}
			<h2
				className={clsx(
					"font-title font-semibold text-gray-800",
					`${titleStyle}`,
				)}
			>
				{title}
			</h2>
			<p className="mt-2 text-sm">{description}</p>
			{children}
		</div>
	);
};

export default EmptyState;
