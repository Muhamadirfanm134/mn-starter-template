# Migrasi Supabase — Trial PRO, Enforcement & Founding Member

## `0001_subscription_trial_and_enforcement.sql`

1. **Kolom trial** di `stores`: `trial_started_at`, `trial_ends_at`, `trial_status`, `has_used_trial`.
2. **`effective_tier()` / `store_effective_tier()`** — sumber kebenaran tier (live, anti cron-lag).
3. **Trigger `trg_set_store_trial`** — otomatis memberi **trial PRO 14 hari** saat store baru dibuat.
4. **Enforcement server-side** (anti-bypass client):
   - `trg_enforce_product_limit` — tolak INSERT produk ke-51 pada tier efektif FREE.
   - `trg_enforce_transaction_limit` — tolak transaksi ke-101 dalam bulan berjalan pada FREE.
5. **`expire_subscriptions()`** + **pg_cron** harian (07:05 WIB) — turunkan trial habis & langganan kedaluwarsa ke FREE.

## `0002_founding_member.sql`

**Founding Member 2026** — harga PRO terkunci **Rp 29.000/bln selamanya** bagi
**50 toko** pertama yang berlangganan, hingga **30 September 2026** (mana lebih dulu).

1. Kolom `is_founding_member`, `founding_claimed_at` di `stores`.
2. **`founding_status()`** — RPC agregat (sisa slot, available, deadline) untuk UI & kuotasi harga. Boleh dipanggil klien.
3. **`grant_founding_member(store_id)`** — klaim slot saat pembayaran berhasil; idempotent + advisory lock (anti oversell); menolak bila kuota/jendela tutup.

- Slot **terpakai saat pembayaran berhasil**: `activateSubscription()` memanggil `grant_founding_member` bila nominal yang dibayar = `FOUNDING_PRICE` (29.000).
- Harga dihitung **server-side** di `createMidtransTransactionHandler` (klien tak bisa memalsukan nominal).
- Konstanta deadline (`2026-09-30`) & max slot (`50`) **harus sinkron** dengan `src/lib/founding.ts`.

## Cara deploy

### Opsi A — Supabase CLI (disarankan)
```bash
supabase db push          # menerapkan semua file di supabase/migrations/ berurutan
```

### Opsi B — SQL Editor (manual)
Buka Supabase Dashboard → SQL Editor → tempel isi `0001_...sql` lalu `0002_...sql` (berurutan) → Run.

### Aktifkan pg_cron
Dashboard → Database → Extensions → aktifkan **pg_cron**, lalu jalankan ulang blok cron di `0001`
(atau migrasi otomatis menjadwalkan job bila ekstensi sudah aktif).

Jika pg_cron tidak tersedia, jadwalkan **Scheduled Edge Function** harian yang memanggil:
```sql
select public.expire_subscriptions();
```

## Catatan penting

- **Limit angka harus sinkron** dengan `src/lib/tier-rules.ts` (FREE: 50 produk, 100 transaksi/bln)
  dan **founding (29k / 50 slot / 30 Sep 2026)** dengan `src/lib/founding.ts`.
- Klien menangkap error trigger dengan kode `check_violation` dan prefix pesan
  `PRODUCT_LIMIT_REACHED` / `TRANSACTION_LIMIT_REACHED` (lihat `src/lib/tier-errors.ts`).
- **Store lama** (dibuat sebelum `0001`) tidak otomatis dapat trial. Untuk memberi trial
  retroaktif ke store FREE yang belum pernah trial:
  ```sql
  update public.stores
  set subscription_tier = 'PRO', trial_status = 'ACTIVE',
      trial_started_at = now(), trial_ends_at = now() + interval '14 days',
      has_used_trial = true
  where subscription_tier = 'FREE' and has_used_trial = false;
  ```

## `0003_trial_reminders.sql` + Edge Function `send-trial-reminders`

Reminder akhir trial via WhatsApp (KirimDev / WA Cloud API), bertahap **H-3, H-1, H-0**.

1. Kolom `trial_reminders_sent` (jsonb) di `stores` — anti dobel-kirim per tahap.
2. `due_trial_reminders()` — daftar toko yang perlu di-reminder hari ini (join `profiles` untuk nomor & nama pemilik).
3. `mark_trial_reminder_sent(store_id, stage)` — tandai tahap terkirim (idempotent).
4. Pengiriman aktual di Edge Function `supabase/functions/send-trial-reminders`.

Kanal aktif dipilih lewat env `CHANNELS` (default `email,push`). Nilai: `email`, `push`, `wa`.

### Opsi 0 — Email + Web Push (tanpa nomor WA, default) ✅
Reuse data yang sudah ada: email dari `profiles.email`, push dari tabel `push_subscriptions`
(diisi saat user klik "Ingatkan saya" di trial banner). Lihat migrasi `0004`.

```bash
supabase db push                              # 0003 + 0004
supabase functions deploy send-trial-reminders
# Email (Resend) — verifikasi domain juwal.id di Resend dulu
supabase secrets set RESEND_API_KEY=re_xxx EMAIL_FROM="Juwal <noreply@juwal.id>"
# Web Push (VAPID) — generate sekali: npx web-push generate-vapid-keys
supabase secrets set VAPID_PUBLIC_KEY=BPxxx VAPID_PRIVATE_KEY=xxx VAPID_SUBJECT=mailto:halo@juwal.id
supabase secrets set CHANNELS=email,push UPGRADE_URL=https://juwal.id/upgrade
```
Frontend butuh **`NEXT_PUBLIC_VAPID_PUBLIC_KEY`** (public key yang sama) di env Vercel
agar tombol opt-in push di trial banner berfungsi.

> Generate VAPID: `npx web-push generate-vapid-keys` → public key dipakai DUA tempat
> (env Edge Function `VAPID_PUBLIC_KEY` **dan** Vercel `NEXT_PUBLIC_VAPID_PUBLIC_KEY`),
> private key hanya di Edge Function.

### (Opsional) Tambah WA
Provider WA dipilih lewat env `WA_PROVIDER` (`fonnte` default, atau `kirimdev`),
aktifkan dengan menambah `wa` ke `CHANNELS` (mis. `CHANNELS=email,push,wa`).

### Opsi A — Fonnte (WA biasa, default) ✅ dipakai sekarang
Pakai nomor WhatsApp biasa (scan QR di dashboard Fonnte). Teks bebas, **tanpa template**.

Prasyarat: daftar Fonnte → connect device (scan QR) → ambil **token device**.
```bash
supabase db push                              # terapkan 0003
supabase functions deploy send-trial-reminders
supabase secrets set \
  WA_PROVIDER=fonnte \
  FONNTE_TOKEN=xxxxxxxx \
  UPGRADE_URL=https://juwal.id/upgrade
```

### Opsi B — KirimDev (WA Cloud API resmi)
Butuh WABA + nomor terverifikasi + **template approved** bahasa `id` (default nama
`trial_reminder`) kategori **Utility**, 3 parameter: `{{1}}` nama · `{{2}}` sisa hari · `{{3}}` link.
```bash
supabase secrets set \
  WA_PROVIDER=kirimdev \
  KIRIMDEV_API_KEY=kdv_live_xxx \
  KIRIMDEV_PHONE_ID=1065xxxxxxxxxx \
  KIRIMDEV_TEMPLATE=trial_reminder \
  UPGRADE_URL=https://juwal.id/upgrade
```
Lalu jadwalkan via pg_cron + pg_net (snippet lengkap ada di komentar bagian 4 `0003_trial_reminders.sql`). Tes manual:
```bash
supabase functions invoke send-trial-reminders   # balikan { total, sent, failed, skipped }
```

> Catatan: toko yang pemiliknya **tak punya nomor** (`profiles.phone` kosong) otomatis dilewati. Pertimbangkan fallback email (Resend) bila perlu.

## Catatan gateway pembayaran

Gateway langganan tunggal saat ini adalah **Midtrans**. Handler & route Xendit
(yang sempat menulis ke kolom `subscription_expiry` yang tidak ada) **sudah dihapus**.
Seluruh kode memakai **`subscription_expires_at`** secara konsisten.
