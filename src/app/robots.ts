import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
	// Hanya production yang boleh diindeks; staging/preview di-blokir total.
	if (!IS_PRODUCTION) {
		return {
			rules: { userAgent: "*", disallow: "/" },
		};
	}

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// Halaman privat / non-publik — jangan diindeks.
			disallow: ["/api/", "/auth/", "/home", "/settings"],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
