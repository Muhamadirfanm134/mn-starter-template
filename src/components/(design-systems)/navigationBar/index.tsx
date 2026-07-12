"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "../button/Button";
import { navItems } from "./constant";

export default function NavigationBar() {
	const pathname = usePathname();

	const shouldShow =
		navItems.some((item) => pathname.startsWith(item.href)) &&
		pathname !== "/transaksi";
	if (!shouldShow) return null;

	return (
		<>
			{/* ── Mobile: bottom tab bar (unchanged) ── */}
			<nav className="fixed right-0 bottom-0 left-0 z-50 rounded-t-4xl border-t bg-white shadow-sm md:hidden">
				<div className="relative flex h-20 items-center justify-between px-4">
					{navItems.map((item, idx) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = isActive ? item.icon.solid : item.icon.outline;

						if (item.isMain) {
							return (
								<div
									key={item.href}
									className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4"
								>
									<Link href={item.href}>
										<Button
											variant="text"
											radius="full"
											className={cn(
												"flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300",
												isActive
													? "scale-105 bg-(--color-primary-600) text-white"
													: "bg-(--color-primary-500) text-white hover:bg-(--color-primary-600)",
											)}
										>
											<Icon className="h-12 w-12 transition-transform duration-300" />
										</Button>
										<p className="mt-1 text-center text-xs font-medium text-(--color-primary-600)">
											{item.label}
										</p>
									</Link>
								</div>
							);
						}

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex flex-1 flex-col items-center justify-center space-y-1 transition-all duration-300",
									idx === 1 && "mr-10 sm:mr-16",
									idx === 3 && "ml-10 sm:ml-16",
								)}
							>
								<Button
									variant="text"
									className="flex flex-col items-center justify-center text-xs"
								>
									<Icon
										className={cn(
											"h-5 w-5 transition-all duration-300",
											isActive
												? "scale-110 text-(--color-primary-600)"
												: "text-gray-500",
										)}
									/>
								</Button>
								<span
									className={cn(
										"text-[11px] font-medium transition-all duration-300",
										isActive ? "text-(--color-primary-600)" : "text-gray-500",
									)}
								>
									{item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</nav>

			{/* ── Tablet / Desktop: floating dock bottom center ── */}
			<nav className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 md:flex">
				<div className="flex flex-row items-center gap-4 rounded-3xl border border-white/30 bg-white/70 px-3 py-2 shadow-2xl backdrop-blur-xl">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = isActive ? item.icon.solid : item.icon.outline;

						return (
							<Link
								key={item.href}
								href={item.href}
								className="group relative flex flex-col items-center"
							>
								{/* Tooltip */}
								<span className="pointer-events-none absolute bottom-full mb-3 rounded-xl bg-gray-900/90 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
									{item.label}
									{/* Arrow */}
									<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90" />
								</span>

								{/* Icon button */}
								<div
									className={cn(
										"relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 hover:-translate-y-1",
										item.isMain
											? isActive
												? "-translate-y-1 scale-110 bg-(--color-primary-600) text-white shadow-lg"
												: "bg-(--color-primary-500) text-white hover:scale-105 hover:bg-(--color-primary-600) hover:shadow-lg"
											: isActive
												? "bg-(--color-primary-50) text-(--color-primary-600)"
												: "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
									)}
								>
									<Icon className="h-6 w-6" />

									{/* Active dot indicator */}
									{isActive && !item.isMain && (
										<span className="absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-(--color-primary-500)" />
									)}
								</div>
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
