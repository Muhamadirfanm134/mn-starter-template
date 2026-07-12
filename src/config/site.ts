/**
 * Sumber data tunggal untuk informasi aplikasi & situs.
 * Isi field sesuai project-mu.
 */

export const SITE = {
	name: "App Starter",
	tagline: "Next.js + Supabase starter template",
	description:
		"Template starter dengan Next.js, Supabase, dan design system siap pakai.",

	// Domain landing/publik kanonik (untuk SEO, OG, canonical).
	url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

	// Kontak
	email: "",
	supportEmail: "",
	whatsapp: "", // contoh: "6281234567890" (format internasional, tanpa +)

	social: {
		instagram: "",
		tiktok: "",
		whatsapp: "",
	},
} as const;

/**
 * Identitas badan hukum (opsional — isi bila perlu untuk halaman legal).
 */
export const COMPANY = {
	legalName: "",
	type: "",
	founder: "",
	domicile: "",
} as const;

export const LEGAL_LAST_UPDATED = "";
