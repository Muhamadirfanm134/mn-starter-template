export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// "production" | "staging" | "development". Set per-environment di Vercel.
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "development";
export const IS_PRODUCTION = APP_ENV === "production";

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";
export const APP_COMMIT_SHA = process.env.NEXT_PUBLIC_APP_COMMIT_SHA || "";

// production: "v0.1.0 (a3f9c2d)" — selain itu sertakan suffix env: "v0.1.0-staging (a3f9c2d)"
const versionBase = IS_PRODUCTION
	? `v${APP_VERSION}`
	: `v${APP_VERSION}-${APP_ENV}`;
export const APP_VERSION_LABEL = APP_COMMIT_SHA
	? `${versionBase} (${APP_COMMIT_SHA})`
	: versionBase;
