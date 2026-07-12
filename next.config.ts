import { execSync } from "node:child_process";
import type { NextConfig } from "next";

function getCommitSha(): string {
	const fromVercel = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
	if (fromVercel) return fromVercel.substring(0, 7);
	try {
		return execSync("git rev-parse --short HEAD", {
			stdio: ["ignore", "pipe", "ignore"],
		})
			.toString()
			.trim();
	} catch {
		return "";
	}
}

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "0.1.0",
		NEXT_PUBLIC_APP_COMMIT_SHA: getCommitSha(),
		// "production" | "staging" | "development". Diset per-environment di Vercel;
		// fallback "development" untuk build lokal.
		NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.supabase.co",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
};

export default nextConfig;
