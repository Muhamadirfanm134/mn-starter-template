"use client";

import { Dialog } from "radix-ui";
import Divider from "../divider/Divider";

type DrawerTopProps = {
	header?: React.ReactNode;
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerTop({
	header,
	children,
	isOpen,
	setIsOpen,
}: DrawerTopProps) {
	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-10000 bg-(--color-grey-800)/50 duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<Dialog.Content
					aria-describedby={undefined}
					className="fixed inset-x-0 top-0 z-10001 mb-40 flex h-auto w-full flex-col rounded-b-2xl bg-white text-left duration-300 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top max-sm:mb-20"
				>
					<Dialog.Title className="p-4 text-2xl font-bold text-(--color-primary-500) md:text-4xl">
						{header}
					</Dialog.Title>

					<Divider type="horizontal" length="w-full !-mt-1" />

					<div className="no-scrollbar mb-[10] flex h-full w-full flex-col overflow-y-scroll px-4">
						{children}
					</div>

					<div className="mb-5 text-center text-gray-400">
						version: {process.env.NEXT_PUBLIC_APP_VERSION}
						{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA &&
							` (${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7)})`}
					</div>

					<div className="flex flex-col items-center">
						<div className="mb-[10] h-[5] w-[100] rounded-full bg-gray-500" />
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
