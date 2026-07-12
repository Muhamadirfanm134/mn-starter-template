"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

/** Ubah VAPID public key (base64url) jadi Uint8Array untuk applicationServerKey. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const raw = atob(base64);
	const output = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
	return output;
}

type PushState =
	| "unsupported"
	| "default"
	| "granted"
	| "denied"
	| "subscribed"
	| "error";

/** Daftar ke push service; jika gagal karena langganan basi, retry sekali. */
async function createSubscription(
	reg: ServiceWorkerRegistration,
): Promise<PushSubscription> {
	const opts: PushSubscriptionOptionsInit = {
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(
			VAPID_PUBLIC_KEY,
		) as BufferSource,
	};
	const existing = await reg.pushManager.getSubscription();
	if (existing) {
		// Langganan lama bisa terikat VAPID key berbeda → buang dulu agar bersih.
		try {
			await existing.unsubscribe();
		} catch {
			// abaikan; lanjut subscribe baru
		}
	}
	return reg.pushManager.subscribe(opts);
}

/**
 * Hook opt-in Web Push untuk reminder trial.
 * - `subscribe()` minta izin notifikasi lalu simpan langganan ke push_subscriptions.
 * - Aman dipanggil di komponen yang punya `storeId` (mis. dari useStore()).
 */
export function useWebPush(storeId?: string) {
	const [state, setState] = useState<PushState>("default");
	const [busy, setBusy] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			!("serviceWorker" in navigator) ||
			!("PushManager" in window) ||
			!VAPID_PUBLIC_KEY
		) {
			setState("unsupported");
			return;
		}
		// Cek apakah sudah ter-subscribe.
		navigator.serviceWorker.ready
			.then((reg) => reg.pushManager.getSubscription())
			.then((sub) => {
				if (sub) setState("subscribed");
				else setState(Notification.permission as PushState);
			})
			.catch(() => setState(Notification.permission as PushState));
	}, []);

	const subscribe = useCallback(async () => {
		if (state === "unsupported" || busy) return;
		setBusy(true);
		setErrorMsg(null);
		try {
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				setState(permission as PushState);
				return;
			}

			const reg = await navigator.serviceWorker.ready;
			const sub = await createSubscription(reg);

			const json = sub.toJSON();
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;

			await supabase.from("push_subscriptions").upsert(
				{
					user_id: auth.user.id,
					store_id: storeId ?? null,
					endpoint: json.endpoint,
					p256dh: json.keys?.p256dh,
					auth: json.keys?.auth,
					user_agent:
						typeof navigator !== "undefined" ? navigator.userAgent : null,
				},
				{ onConflict: "endpoint" },
			);

			setState("subscribed");
		} catch (e) {
			// Tangani agar tidak jadi unhandledRejection. AbortError "push service
			// error" biasanya: browser memblokir push (Brave) atau FCM tak terjangkau.
			const msg = e instanceof Error ? e.message : String(e);
			console.warn("Web push subscribe gagal:", msg);
			setErrorMsg(msg);
			setState("error");
		} finally {
			setBusy(false);
		}
	}, [state, busy, storeId]);

	return {
		state,
		busy,
		errorMsg,
		subscribe,
		isSubscribed: state === "subscribed",
	};
}
