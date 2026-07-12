import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
	console.warn(
		"[supabase] Kredensial belum diset. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan " +
			"NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu restart dev server. " +
			"Nilai bisa diambil dari Supabase Dashboard → Project Settings → API.",
	);
}

// Fallback placeholder agar app tidak crash saat kredensial belum diisi (mode template).
// Panggilan Supabase yang sebenarnya akan gagal sampai kredensial asli diset.
export const supabase = createBrowserClient(
	supabaseUrl || "https://placeholder.supabase.co",
	supabaseKey || "placeholder-anon-key",
);
