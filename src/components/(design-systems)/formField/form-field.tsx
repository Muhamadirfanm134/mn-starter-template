"use client";

import clsx from "clsx";
import { CircleAlertIcon } from "lucide-react";
import type { JSX } from "react";
import {
	Controller,
	type ControllerRenderProps,
	type FieldValues,
	useFormContext,
} from "react-hook-form";

type FormFieldProps = {
	name: string;
	label?: string;
	helperText?: string;
	required?: boolean;
	children: (
		field: ControllerRenderProps<FieldValues, string>,
		hasError: boolean,
	) => JSX.Element;
};

export const FormField = ({
	name,
	label,
	helperText,
	required,
	children,
}: FormFieldProps) => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	const errorMessage = errors[name]?.message as string | undefined;
	const hasError = !!errorMessage;

	return (
		<div className="flex w-full flex-col gap-1">
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
				render={({ field }) => children(field, hasError)}
			/>

			{hasError ? (
				<div className="flex items-center gap-1">
					<CircleAlertIcon size={14} className="text-red-500" />
					<p className="text-xs text-red-500">{errorMessage}</p>
				</div>
			) : (
				helperText && <p className="text-xs text-gray-500">{helperText}</p>
			)}
		</div>
	);
};
