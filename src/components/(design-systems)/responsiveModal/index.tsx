"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { m } from "framer-motion";
import { X } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	children: ReactNode;
	withCloseButton?: boolean;
	zIndex?: number;
}

export default function ResponsiveModal({
	isOpen,
	onOpenChange,
	title,
	children,
	withCloseButton = false,
	zIndex = 100,
}: ResponsiveModalProps) {
	const [isMobile, setIsMobile] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	// Only check mobile on mount and orientation change — NOT on resize,
	// because keyboard open/close fires resize and would cause re-render & close.
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();

		const mediaQuery = window.matchMedia("(max-width: 767px)");
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Focus the first input only after animation completes on mobile
	const handleAnimationComplete = useCallback(() => {
		if (isMobile && contentRef.current) {
			const input = contentRef.current.querySelector<HTMLInputElement>(
				"input, textarea, select",
			);
			if (input) {
				// Small delay to ensure the drawer is fully settled
				setTimeout(() => input.focus(), 100);
			}
		}
	}, [isMobile]);

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay asChild>
					<m.div
						className="fixed inset-0 bg-black/50"
						style={{ zIndex: zIndex }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
				</Dialog.Overlay>

				<Dialog.Content
					asChild
					onOpenAutoFocus={(e) => {
						// Prevent Radix from auto-focusing on open — this triggers
						// the keyboard immediately on mobile, which resizes the
						// viewport and pushes the bottom sheet away.
						if (isMobile) e.preventDefault();
					}}
				>
					<m.div
						ref={contentRef}
						className={cn(
							"fixed w-full bg-white p-6 shadow-xl will-change-transform md:max-w-lg",
							isMobile
								? "right-0 bottom-0 left-0 rounded-t-4xl"
								: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-4xl",
						)}
						style={{ zIndex: zIndex + 10 }}
						initial={
							isMobile ? { y: "100%" } : { opacity: 0, y: -50, scale: 0.95 }
						}
						animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
						exit={
							isMobile ? { y: "100%" } : { opacity: 0, y: -50, scale: 0.95 }
						}
						transition={{ duration: 0.25, ease: "easeOut" }}
						onAnimationComplete={handleAnimationComplete}
					>
						<div className="absolute top-2 left-0 flex w-full items-center justify-center md:hidden">
							<div className="h-1 w-8 rounded-full bg-(--color-neutral-600)" />
						</div>

						<div className="mb-4 flex items-center justify-between">
							{title && (
								<Dialog.Title
									className={cn("w-full text-lg font-semibold", {
										"text-center": !withCloseButton,
									})}
								>
									{title}
								</Dialog.Title>
							)}
							{withCloseButton && (
								<Dialog.Close asChild>
									<button
										type="button"
										className="cursor-pointer rounded-full border-1 border-gray-200 bg-white p-3 text-gray-500 hover:text-gray-800"
									>
										<X size={20} />
									</button>
								</Dialog.Close>
							)}
						</div>

						<div>{children}</div>
					</m.div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
