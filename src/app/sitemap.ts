import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const fullUrl = (path: string) => `${SITE_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes = ["/", "/login"];

	return staticRoutes.map((route) => ({
		url: fullUrl(route),
		lastModified: new Date().toISOString(),
	}));
}
