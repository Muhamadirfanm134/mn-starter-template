const CACHE_NAME = "app-pwa-cache-v1";
const OFFLINE_URL = "/";

const urlsToCache = ["/", "/manifest.json", "/icon.png"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		}),
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.mode === "navigate") {
		event.respondWith(
			fetch(event.request).catch(() => {
				return caches.open(CACHE_NAME).then((cache) => {
					return cache.match(OFFLINE_URL);
				});
			}),
		);
	} else {
		event.respondWith(
			caches.match(event.request).then((response) => {
				return response || fetch(event.request);
			}),
		);
	}
});

// --- Web Push: tampilkan notifikasi reminder trial ---
self.addEventListener("push", (event) => {
	let data = {};
	try {
		data = event.data ? event.data.json() : {};
	} catch (_e) {
		data = { title: "App Starter", body: event.data ? event.data.text() : "" };
	}
	const title = data.title || "App Starter";
	event.waitUntil(
		self.registration.showNotification(title, {
			body: data.body || "",
			icon: "/icon.png",
			badge: "/icon.png",
			data: { url: data.url || "/home" },
		}),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const url =
		(event.notification.data && event.notification.data.url) || "/home";
	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((list) => {
				for (const client of list) {
					if (client.url.includes(url) && "focus" in client)
						return client.focus();
				}
				return clients.openWindow(url);
			}),
	);
});

self.addEventListener("activate", (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
					return Promise.resolve();
				}),
			);
		}),
	);
});
