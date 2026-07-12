"use client";

import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { LucideCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTailwindBreakpoint } from "@/hooks/useTailwindBreakpoint";
import type { OnChange, Option } from "@/lib/types";
import { truncateToOneLine } from "@/utils/stringManipulations";
import ResponsiveModal from "../responsiveModal";

type SelectInputProps = {
	options: Option[];
	selected?: string;
	onChange: (value: OnChange) => void;
	rounded?: "md" | "lg" | "xl" | "full";
	width?: string;
	icon?: React.SVGProps<SVGSVGElement>;
	className?: string;
	placeholder?: string;
	name: string;
	type?: "primary" | "secondary";
	modalZIndex?: number;
	id?: string;
};

export default function SelectInput({
	options,
	selected,
	onChange,
	rounded = "xl",
	width = "52",
	icon,
	className,
	placeholder = "Pilih...",
	name,
	type = "primary",
	modalZIndex,
	id,
}: SelectInputProps) {
	const breakpoint = useTailwindBreakpoint();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const isMobile =
		breakpoint === "xs" || breakpoint === "sm" || breakpoint === null;

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const selectedOption = options.find((e) => e.value === selected);

	const buttonContent = (
		<>
			{icon && <>{icon}</>}
			{selected ? (
				<div className="truncate">
					{truncateToOneLine(selectedOption?.label || "", 50)}
				</div>
			) : (
				<div className="text-sm text-(--color-grey-500)">{placeholder}</div>
			)}
			<ChevronDownIcon
				className="group pointer-events-none absolute right-4 size-4 fill-(--color-grey-800)"
				aria-hidden="true"
			/>
		</>
	);

	const buttonClasses = clsx(
		`relative flex w-full gap-2 rounded-${rounded} h-[44px] cursor-pointer items-center py-1.5 pr-8 pl-4 text-left text-sm/6 text-(--color-grey-800)`,
		"focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
		`${
			type === "primary"
				? "border border-gray-300 bg-white"
				: "bg-(--color-grey-100)"
		}`,
	);

	const SearchInput = (
		<div className="sticky top-0 z-10 mb-2 border-b border-gray-100 bg-white pt-1 pb-2">
			<input
				type="text"
				placeholder="Cari..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none"
				onClick={(e) => e.stopPropagation()}
			/>
		</div>
	);

	if (isMobile) {
		return (
			<div className={clsx(`relative mx-auto w-${width}`, className)}>
				<button
					id={id}
					type="button"
					onClick={() => setIsModalOpen(true)}
					className={buttonClasses}
				>
					{buttonContent}
				</button>

				<ResponsiveModal
					isOpen={isModalOpen}
					onOpenChange={setIsModalOpen}
					title={placeholder}
					zIndex={modalZIndex}
				>
					<div className="flex flex-col">
						{options.length > 8 && SearchInput}
						<div className="scrollbar-hide flex max-h-[60vh] flex-col gap-1 overflow-y-auto pt-1 pb-4">
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option) => (
									<button
										key={option.id}
										type="button"
										onClick={() => {
											onChange({ name, value: option.value as string });
											setIsModalOpen(false);
											setSearchQuery("");
										}}
										className={clsx(
											"flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-colors active:bg-gray-100",
											selected === option.value
												? "bg-primary-50 text-primary-600"
												: "text-gray-700",
										)}
									>
										{option.icon ? (
											<Image
												src={option.icon}
												alt="icon"
												width={24}
												height={24}
											/>
										) : (
											<div
												className={clsx(
													"flex h-6 w-6 items-center justify-center rounded-full border",
													selected === option.value
														? "border-primary-500 bg-primary-500 text-white"
														: "border-gray-300",
												)}
											>
												{selected === option.value && <LucideCheck size={14} />}
											</div>
										)}
										<span className="text-sm font-medium">{option.label}</span>
									</button>
								))
							) : (
								<div className="py-12 text-center text-sm text-gray-400">
									Tidak ada hasil
								</div>
							)}
						</div>
					</div>
				</ResponsiveModal>
			</div>
		);
	}

	return (
		<div className={clsx(`relative mx-auto w-${width}`, className)}>
			<Listbox
				value={selected}
				onChange={(value) => {
					onChange({
						name: name,
						value: value,
					});
				}}
			>
				<ListboxButton id={id} className={buttonClasses}>
					{buttonContent}
				</ListboxButton>
				<ListboxOptions
					transition
					className={clsx(
						"absolute left-0 z-110 mt-1 w-full rounded-xl border border-gray-300 bg-white p-1 shadow-lg focus:outline-none",
						"transition duration-100 ease-in data-leave:data-closed:opacity-0",
					)}
				>
					<div className="p-2">
						{options.length > 8 && SearchInput}
						<div className="max-h-60 overflow-y-auto pt-1">
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option) => (
									<ListboxOption
										key={option.id}
										value={option.value}
										className="group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-(--color-grey-800)/10"
									>
										{option.icon ? (
											<Image
												src={option.icon}
												alt="icon"
												width={20}
												height={20}
											/>
										) : (
											<CheckIcon className="invisible size-4 fill-(--color-primary-500) group-data-selected:visible" />
										)}
										<div className="text-sm/6 text-(--color-grey-800) group-data-selected:text-(--color-primary-500)">
											{option.label}
										</div>
									</ListboxOption>
								))
							) : (
								<div className="py-4 text-center text-xs text-gray-400">
									Tidak ada hasil
								</div>
							)}
						</div>
					</div>
				</ListboxOptions>
			</Listbox>
		</div>
	);
}
