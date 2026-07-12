# mn-starter-template

Starter template Next.js untuk memulai project baru dengan cepat, lengkap
dengan **design system** siap pakai, autentikasi Supabase, i18n, PWA, dan
tooling kualitas kode.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS 4 (design tokens via CSS variables) + `tw-animate-css`
- **UI**: Design system internal (`src/components/(design-systems)`) + shadcn/Radix UI + Headless UI + lucide/heroicons
- **State & data**: TanStack Query, Zustand
- **Form**: react-hook-form + zod (`@hookform/resolvers`)
- **Auth & DB**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **i18n**: next-intl (locale `en` & `id`)
- **Animasi**: framer-motion
- **PWA**: service worker + web-push (VAPID)
- **Feature flags**: Vercel Flags SDK
- **Tooling**: Biome (format + lint), Husky pre-commit + lint-staged, commitlint, release-it, Vitest + Testing Library

## Menjalankan

```bash
pnpm install
cp .env.example .env.local   # lalu isi kredensial Supabase, dll.
pnpm dev                     # http://localhost:3000
```

Script lain:

| Script | Fungsi |
| --- | --- |
| `pnpm build` / `pnpm start` | Build & jalankan production |
| `pnpm check` / `pnpm lint:fix` | Cek / perbaiki dengan Biome |
| `pnpm format` | Format kode |
| `pnpm test` / `pnpm test:coverage` | Jalankan Vitest |
| `pnpm release` / `pnpm release:dry` | Rilis via release-it (lihat `RELEASING.md`) |

## Struktur

```
src/
├── app/                       # Route (App Router)
│   ├── (protected-route)/     # Route terproteksi (home, settings)
│   ├── login/ · auth/         # Autentikasi Supabase
│   └── api/supabase-image/    # Proxy gambar Supabase
├── components/
│   ├── (design-systems)/      # 🎨 DESIGN SYSTEM — komponen inti
│   └── ui/                    # Primitif shadcn + Wrapper/Footer/Icon
├── features/                  # Fitur (auth, login) — tambahkan milikmu
├── hooks/ · utils/ · lib/     # Hooks & helper generik
├── providers/                 # Motion, TanStack Query, Theme
├── i18n/ · services/          # Konfigurasi next-intl
├── flags/                     # Feature flags
└── themeConfig/               # Konfigurasi tema (CSS variables)
```

### Design system

Komponen di `src/components/(design-systems)/` mencakup: `alert`, `button`,
`input`, `textArea`, `selectInput`, `formField`, `modal`, `responsiveModal`,
`drawer`, `tabs`, `toast`, `notification`, `uploader`, `image`, `supabaseImage`,
`barcode-scanner`, `search-input`, `breadcrumb`, `navigationBar`, `mobileHeader`,
`menuItem`, `clickableCard`, `glassCard`, `paralaxCard`, `collapsibleList`,
`detailItem`, `divider`, `dragableSlider`, `empty-state`, `loader`. Import via
alias `@/components/(design-systems)/...`.

## Environment

Lihat `.env.example` untuk daftar variabel (Supabase, VAPID/web-push, feature
flags). Jangan commit `.env.local`.
