"use client";

import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/(design-systems)/loader";
import { supabase } from "@/utils/supabase/client";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const checkSession = async () => {
			// Ambil session aktif
			const { data } = await supabase.auth.getSession();

			if (!data.session) {
				router.replace("/login"); // Redirect ke login jika tidak ada session
			} else {
				setSession(data.session);
			}

			setLoading(false);
		};

		checkSession();

		// Listener untuk perubahan login/logout
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!session) {
				router.replace("/login");
			} else {
				setSession(session);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [router]);

	// Hindari render apa pun di server yang bergantung pada state dinamis untuk mencegah hydration error
	if (!mounted || loading) return <Loader text="Memuat halaman..." fullPage />;

	// Render konten jika sudah login
	return <>{session ? children : null}</>;
}
