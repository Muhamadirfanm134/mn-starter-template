import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/(design-systems)/button/Button";

export const metadata: Metadata = {
	title: "mono-ui — Next.js starter",
	description:
		"A Next.js starter wired up with Supabase, a design system, i18n, and PWA support. Skip the setup and start shipping.",
};

const STACK = [
	"Next.js 16",
	"React 19",
	"Tailwind 4",
	"Supabase",
	"TanStack Query",
	"Biome",
	"PWA",
	"i18n",
];

export default function Page() {
	return (
		<main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
			{/* Background glow */}
			<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-(--color-primary-300)/30 blur-[120px]" />
				<div className="absolute right-[15%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-(--color-primary-500)/20 blur-[120px]" />
				<div className="absolute left-[10%] bottom-[20%] h-[280px] w-[280px] rounded-full bg-(--color-primary-400)/20 blur-[120px]" />
			</div>

			<div className="flex flex-col items-center gap-6 duration-700 animate-in fade-in slide-in-from-bottom-6">
				{/* Logo */}
				<Image
					src="/mono-ui-logo.png"
					alt="mono-ui"
					width={400}
					height={400}
					priority
					className="h-60 w-auto object-contain md:h-28"
				/>

				{/* Badge */}
				<span className="inline-flex items-center gap-2 rounded-full border border-(--color-primary-200) bg-(--color-primary-50) px-4 py-1.5 text-caption font-medium text-(--color-primary-700)">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-primary-400) opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-primary-500)" />
					</span>
					Starter template
				</span>

				{/* Heading */}
				<h1 className="max-w-3xl bg-gradient-to-br from-(--color-primary-400) via-(--color-primary-500) to-(--color-primary-700) bg-clip-text text-h1 font-extrabold leading-tight text-transparent md:text-hero">
					Start with the
					<br />
					boring parts done
				</h1>

				{/* Subtitle */}
				<p className="max-w-xl text-body text-gray-500">
					Auth, a design system, i18n, and PWA are already wired up. Clone it,
					add your keys, and get straight to building the thing you actually
					care about.
				</p>

				{/* CTA */}
				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
					<Button variant="primary" href="/login" size="lg">
						Get started
					</Button>
					<Button
						variant="outline"
						href="https://github.com"
						target="_blank"
						size="lg"
					>
						View docs
					</Button>
				</div>

				{/* Stack chips */}
				<div className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
					{STACK.map((tech) => (
						<span
							key={tech}
							className="rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-caption font-medium text-gray-600 backdrop-blur transition hover:border-(--color-primary-300) hover:text-(--color-primary-600)"
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</main>
	);
}
