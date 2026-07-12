import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientToaster from "@/components/(design-systems)/toast/ClientToaster";
import { PWARegister } from "@/components/PWARegister";
import { Wrapper } from "@/components/ui/Wrapper";
import { MotionProvider } from "@/providers/MotionProvider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "App Starter",
	description: "Next.js + Supabase starter template dengan design system.",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		title: "App Starter",
		statusBarStyle: "default",
	},
};

export const viewport: import("next").Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<PWARegister />
				<MotionProvider>
					<Wrapper>{children}</Wrapper>
				</MotionProvider>
				<ClientToaster />
			</body>
		</html>
	);
}
