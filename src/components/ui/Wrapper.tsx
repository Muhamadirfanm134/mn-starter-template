"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import TanstackProviders from "@/providers/TanstackProviders";
import { ThemeProvider } from "@/providers/themeProvider";
import { THEME_CONFIG } from "@/themeConfig/themeConfig";
import { useMounted } from "@/utils/useMounted";

const NavigationBar = dynamic(
	() => import("@/components/(design-systems)/navigationBar"),
	{ ssr: false, loading: () => null },
);

export const Wrapper = ({ children }: { children: ReactNode }) => {
	const mounted = useMounted();
	const pathname = usePathname();

	const hideNavbarOnPages = ["/", "/login"];
	const shouldHideNavbar = hideNavbarOnPages.some((page) => pathname === page);

	return (
		<TanstackProviders>
			<ThemeProvider themeData={THEME_CONFIG}>
				<div
					className={cn(
						"mx-auto flex w-full flex-col bg-white",
						"max-w-7xl",
						pathname === "/login" ? "h-dvh" : "min-h-dvh",
					)}
				>
					<div
						className={cn(
							"flex-1",
							pathname !== "/login" && "p-4 md:px-8 md:pb-28",
						)}
					>
						{children}
					</div>
					{mounted && !shouldHideNavbar && <NavigationBar />}
				</div>
			</ThemeProvider>
		</TanstackProviders>
	);
};
