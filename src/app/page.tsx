import type { Metadata } from "next";
import Button from "@/components/(design-systems)/button/Button";

export const metadata: Metadata = {
	title: "App Starter — Next.js + Supabase + Design System",
	description:
		"Template starter dengan Next.js 16, React 19, Tailwind 4, Supabase, TanStack Query, dan design system siap pakai.",
};

export default function Page() {
	return (
		<main className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 px-6 text-center">
			<h1 className="text-h2 font-bold text-(--color-primary-500)">
				App Starter
			</h1>
			<p className="max-w-md text-body2 text-gray-500">
				Template project Next.js + Supabase dengan design system, i18n, PWA, dan
				tooling (Biome, Husky, release-it) siap pakai.
			</p>
			<Button variant="primary" href="/login" size="lg">
				Mulai
			</Button>
		</main>
	);
}
