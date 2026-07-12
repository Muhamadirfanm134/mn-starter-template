# Releasing

Project ini memakai **release-it** + **conventional-changelog** untuk otomasi
rilis berbasis [Conventional Commits](https://www.conventionalcommits.org/).

## Prasyarat

- Berada di branch `main`, working dir bersih, dan sudah `git push` (ada upstream).
- Pesan commit mengikuti Conventional Commits (`feat:`, `fix:`, `chore:`, ...).
  Ini divalidasi oleh commitlint (hook `commit-msg`) dan pre-commit `lint-staged`.

## Alur

```bash
# Cek dulu tanpa mengubah apa pun
pnpm release:dry

# Rilis sungguhan (bump versi, update CHANGELOG.md, tag, GitHub release)
pnpm release
```

`pnpm release` akan:

1. Menentukan versi berikutnya dari jenis commit sejak tag terakhir.
2. Menulis `CHANGELOG.md`.
3. Membuat commit `chore: release v<version>` dan tag `v<version>`.
4. Membuat GitHub Release.

Konfigurasi ada di [`.release-it.json`](.release-it.json). Tambahkan hook
`after:release` bila ingin memicu deploy otomatis (mis. ke Vercel).
