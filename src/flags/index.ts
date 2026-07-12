import { flag } from "flags/next";

/**
 * Feature flags (Vercel Flags SDK).
 *
 * Pola trunk-based: fitur yang belum siap tetap di-merge ke `main`, tapi
 * "dimatikan" lewat flag sampai layak rilis. Default `decide` membaca env
 * `NEXT_PUBLIC_FF_<KEY>` sehingga nilainya bisa berbeda per-environment Vercel
 * (mis. ON di staging, OFF di production). Default aman: OFF bila env tak diset.
 *
 * Override sementara tanpa redeploy bisa lewat Vercel Toolbar (butuh FLAGS_SECRET
 * & endpoint discovery di app/.well-known/vercel/flags/route.ts).
 */

function envEnabled(name: string): boolean {
	return process.env[name] === "true" || process.env[name] === "1";
}

// Contoh flag — ganti/duplikat sesuai kebutuhan project.
export const exampleFeatureFlag = flag<boolean>({
	key: "example-feature",
	description: "Contoh feature flag.",
	defaultValue: false,
	decide: () => envEnabled("NEXT_PUBLIC_FF_EXAMPLE_FEATURE"),
});

// Daftarkan setiap flag baru di sini agar muncul di Vercel Toolbar.
export const flags = {
	exampleFeatureFlag,
};
