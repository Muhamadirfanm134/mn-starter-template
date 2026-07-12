import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/home";

	if (code) {
		const cookieStore = await cookies();

		const supabase = createServerClient(
			// biome-ignore lint/style/noNonNullAssertion: Env var must exist
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			// biome-ignore lint/style/noNonNullAssertion: Env var must exist
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						try {
							cookiesToSet.forEach(({ name, value, options }) => {
								cookieStore.set(name, value, options);
							});
						} catch {
							// The `setAll` method was called from a Server Component.
							// This can be ignored if you have middleware refreshing user sessions.
						}
					},
				},
			},
		);

		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && data.session) {
			const user = data.session.user;
			const meta = user.user_metadata;

			// Sync Google profile data to profiles table
			// Only update fields that are empty/null (don't overwrite user-edited data)
			const { data: existingProfile } = await supabase
				.from("profiles")
				.select("fullname, avatar_url, email, phone")
				.eq("id", user.id)
				.single();

			const updates: Record<string, string> = {};

			// Sync fullname from Google if profile doesn't have one
			if (!existingProfile?.fullname && meta?.full_name) {
				updates.fullname = meta.full_name;
			}

			// Sync avatar_url from Google if profile doesn't have one
			if (!existingProfile?.avatar_url && meta?.avatar_url) {
				updates.avatar_url = meta.avatar_url;
			}

			// Sync email from Google if profile doesn't have one
			if (!existingProfile?.email && user.email) {
				updates.email = user.email;
			}

			// Sync phone from Google if profile doesn't have one
			if (!existingProfile?.phone && (user.phone || meta?.phone_number)) {
				updates.phone = user.phone || meta.phone_number;
			}

			if (Object.keys(updates).length > 0) {
				await supabase
					.from("profiles")
					.update({
						...updates,
						updated_at: new Date().toISOString(),
					})
					.eq("id", user.id);
			}

			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// Return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
