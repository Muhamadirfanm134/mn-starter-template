"use client";

import { Dialog } from "radix-ui";

type DrawerProps = {
	header?: React.ReactNode;
	description?: string;
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Drawer({
	header,
	description = "",
	children,
	isOpen,
	setIsOpen,
}: DrawerProps) {
	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-30 bg-(--color-grey-800)/50 duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[70vw] flex-col justify-between overflow-hidden rounded-r-2xl bg-white text-left duration-300 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left md:w-sm lg:w-md">
					<Dialog.Title className="flex items-center justify-center p-5 text-2xl font-bold text-(--color-primary-500) md:text-4xl">
						{header}
					</Dialog.Title>
					<div className="h-full overflow-y-scroll">
						<Dialog.Description>{description}</Dialog.Description>
						<div className="p-4">{children}</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
