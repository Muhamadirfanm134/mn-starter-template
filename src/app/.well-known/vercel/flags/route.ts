import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import { flags } from "@/flags";

/**
 * Endpoint discovery untuk Vercel Toolbar — memungkinkan override flag tanpa
 * redeploy. Diproteksi oleh env `FLAGS_SECRET`.
 */
export const GET = createFlagsDiscoveryEndpoint(async () =>
	getProviderData(flags),
);
