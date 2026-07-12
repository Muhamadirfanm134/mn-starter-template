<div align="center">

<img src="./public/mono-ui-logo.png" alt="mono-ui" width="220" />

# mono-ui · Next.js Starter

**Start with the boring parts done.**

Auth, a design system, i18n, and PWA — already wired up. Clone it, add your keys, and get straight to building.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" />
  <img alt="Biome" src="https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white" />
</p>

</div>

---

## ✨ What's inside

| | |
| --- | --- |
| ⚡ **Framework** | Next.js 16 (App Router + Turbopack) · React 19 · TypeScript 5 |
| 🎨 **Styling** | Tailwind CSS 4 with design tokens (CSS variables) · `tw-animate-css` |
| 🧩 **UI** | In-house design system + shadcn/Radix + Headless UI + lucide/heroicons |
| 🔄 **State & data** | TanStack Query · Zustand |
| 📝 **Forms** | react-hook-form + zod |
| 🔐 **Auth & DB** | Supabase (`@supabase/ssr`) |
| 🌍 **i18n** | next-intl (`en` · `id`) |
| 🎞️ **Motion** | framer-motion |
| 📱 **PWA** | service worker + web-push (VAPID) |
| 🚩 **Feature flags** | Vercel Flags SDK |
| 🛠️ **Tooling** | Biome · Husky + lint-staged · commitlint · release-it · Vitest |

## 🚀 Quick start

```bash
pnpm install
cp .env.example .env.local   # then fill in your Supabase keys
pnpm dev                     # http://localhost:3000
```

> The app runs without Supabase keys — you'll just see a console warning until you add them.

### Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` · `pnpm start` | Build & run for production |
| `pnpm check` · `pnpm lint:fix` | Check / autofix with Biome |
| `pnpm format` | Format the codebase |
| `pnpm test` · `pnpm test:coverage` | Run Vitest |
| `pnpm release` · `pnpm release:dry` | Cut a release (see `RELEASING.md`) |

## 📁 Project structure

```
src/
├── app/                       # Routes (App Router)
│   ├── (protected-route)/     # Protected routes (home, settings)
│   ├── login/ · auth/         # Supabase authentication
│   └── api/supabase-image/    # Supabase image proxy
├── components/
│   ├── (design-systems)/      # 🎨 DESIGN SYSTEM — core components
│   └── ui/                    # shadcn primitives + wrappers
├── features/                  # Feature modules (auth, login) — add yours here
├── hooks/ · utils/ · lib/     # Generic hooks & helpers
├── providers/                 # Motion, TanStack Query, Theme
├── i18n/ · services/          # next-intl config
├── flags/                     # Feature flags
└── themeConfig/               # Theme config (CSS variables)
```

## 🎨 Design system

Everything under `src/components/(design-systems)/`, imported via `@/components/(design-systems)/...`:

`alert` · `button` · `input` · `textArea` · `selectInput` · `formField` · `modal` · `responsiveModal` · `drawer` · `tabs` · `toast` · `notification` · `uploader` · `image` · `supabaseImage` · `barcode-scanner` · `search-input` · `breadcrumb` · `navigationBar` · `mobileHeader` · `menuItem` · `clickableCard` · `glassCard` · `paralaxCard` · `collapsibleList` · `detailItem` · `divider` · `dragableSlider` · `empty-state` · `loader`

## 🔧 Environment

See [`.env.example`](./.env.example) for the full list of variables (Supabase, VAPID/web-push, feature flags). **Never commit `.env.local`.**

---

<div align="center">
<sub>Built with ☕ and Next.js — happy shipping.</sub>
</div>
