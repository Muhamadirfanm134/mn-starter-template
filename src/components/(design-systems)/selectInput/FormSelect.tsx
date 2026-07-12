"use client";

import clsx from "clsx";
import { CircleAlertIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type { Option } from "@/lib/types";
import SelectInput from "./SelectInput";

interface FormSelectProps {
	name: string;
	label?: string;
	options: Option[];
	helperText?: string;
	required?: boolean;
	placeholder?: string;
	className?: string;
}

export const FormSelect = ({
	name,
	label,
	options,
	helperText,
	required,
	placeholder,
	className,
}: FormSelectProps) => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	const errorMessage = errors[name]?.message as string | undefined;
	const hasError = !!errorMessage;

	return (
		<div className={clsx("flex w-full flex-col gap-1", className)}>
			{label && (
				<label
					htmlFor={name}
					className={clsx(
						"text-sm font-medium",
						hasError ? "text-red-600" : "text-gray-700",
					)}
				>
					{label}
					{required && <span className="ml-0.5 text-red-500">*</span>}
				</label>
			)}

			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<SelectInput
						{...field}
						name={name}
						options={options}
						selected={field.value}
						onChange={(opt) => field.onChange(opt.value)}
						placeholder={placeholder}
						className="w-full!"
						width="full"
					/>
				)}
			/>

			{hasError ? (
				<div className="flex items-center gap-1">
					<CircleAlertIcon size={14} className="text-red-500" />{" "}
					<p className="text-xs text-red-500">{errorMessage}</p>
				</div>
			) : (
				helperText && <p className="text-xs text-gray-500">{helperText}</p>
			)}
		</div>
	);
};
