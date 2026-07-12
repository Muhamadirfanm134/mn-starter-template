"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import ButtonV2 from "../button/Button";

export const Modal = ({
	isOpen,
	close,
	children,
	withCloseButton = false,
	width,
}: {
	isOpen: boolean;
	close: () => void;
	children: ReactNode;
	withCloseButton?: boolean;
	width?: string;
}) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-1000 bg-(--color-grey-800)/50 duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<Dialog.Content
					aria-describedby={undefined}
					className={clsx(
						"fixed top-1/2 left-1/2 z-1000 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-3xl bg-white backdrop-blur-2xl duration-300 focus:outline-none",
						"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
						withCloseButton ? "px-10 pt-[60px] pb-10" : "p-10",
						width ? `${width}` : "w-full max-w-md",
					)}
				>
					<Dialog.Title className="sr-only">Dialog</Dialog.Title>
					{withCloseButton && (
						<Dialog.Close asChild>
							<ButtonV2
								variant="filled"
								icon={
									<XMarkIcon
										width={20}
										className="text-(--color-primary-500)"
									/>
								}
								radius="full"
								className="absolute top-[24px] right-[24px]"
							/>
						</Dialog.Close>
					)}
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
