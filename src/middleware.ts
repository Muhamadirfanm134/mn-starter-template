import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware minimal untuk template.
 *
 * Saat ini no-op (meneruskan semua request). Kalau butuh proteksi route
 * server-side atau refresh session Supabase, tambahkan helper
 * `updateSession` dari `@supabase/ssr` di sini.
 */
export function middleware(_request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	// Jalankan di semua route kecuali internal Next, auth callback, API, & aset statis.
	matcher: [
		"/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
	],
};
