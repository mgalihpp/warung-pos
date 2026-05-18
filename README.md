# Warung Mama Nia POS

Aplikasi point of sale untuk warung sembako Mama Nia berbasis Next.js. Aplikasi ini mendukung pengelolaan barang, stok, transaksi kasir, laporan penjualan, dan akses berbasis role untuk admin serta kasir.

## Fitur Utama

- Autentikasi menggunakan Better Auth.
- Role akses `admin` dan `cashier`.
- Dashboard admin dan kasir.
- Manajemen barang, kategori, harga beli, harga jual, stok, dan gambar barang.
- POS untuk pencatatan transaksi penjualan.
- Riwayat transaksi dan edit transaksi admin.
- Laporan kas, kasir, stok, dan penjualan.
- Audit perubahan stok melalui data `StockAdjustment`.
- Upload gambar barang menggunakan UploadThing.
- Dukungan PWA untuk pengalaman penggunaan seperti aplikasi.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- Better Auth
- Tailwind CSS v4
- shadcn/ui
- UploadThing
- Zustand
- TanStack React Query

## Prasyarat

- Node.js dan npm.
- Database PostgreSQL.
- Akun UploadThing jika ingin menggunakan fitur upload gambar barang.

## Setup Environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Isi variabel berikut di `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="password123"
ADMIN_NAME="Admin"
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

Catatan:

- `DIRECT_URL` digunakan Prisma CLI untuk generate, migration, push, dan seed.
- Runtime Prisma memakai `DIRECT_URL`, lalu fallback ke `DATABASE_URL` jika `DIRECT_URL` tidak tersedia.
- `DATABASE_URL` dapat diarahkan ke connection pooler atau transaction mode.
- Password admin minimal 8 karakter.

## Instalasi

Install dependency:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run db:generate
```

Sinkronkan schema database. Untuk development cepat, gunakan:

```bash
npm run db:push
```

Atau gunakan migration development:

```bash
npm run db:migrate
```

Isi data kategori dan barang contoh:

```bash
npm run db:seed
```

Buat akun admin dari environment:

```bash
npm run db:create-admin
```

## Menjalankan Aplikasi

Jalankan server development:

```bash
npm run dev
```

Buka aplikasi di:

```text
http://localhost:3000
```

Halaman root akan mengarah ke `/login`.

## Role dan Akses

- Admin diarahkan ke `/admin` dan dapat mengakses halaman admin.
- Cashier diarahkan ke `/cashier` dan dapat mengakses alur POS kasir.
- Proteksi route dikontrol dari `proxy.ts` dengan aturan path di `lib/auth-routes.ts`.

## Route Penting

- `/login` - halaman login.
- `/register` - halaman registrasi.
- `/admin` - dashboard admin.
- `/admin/barang` - manajemen barang.
- `/admin/barang/tambah` - tambah barang.
- `/admin/pos` - POS dari sisi admin.
- `/admin/transaksi` - daftar transaksi admin.
- `/admin/laporan` - ringkasan laporan.
- `/admin/laporan/kas` - laporan kas.
- `/admin/laporan/kasir` - laporan kasir.
- `/admin/laporan/stok` - laporan stok.
- `/admin/pengaturan` - pengaturan admin.
- `/cashier` - dashboard kasir.
- `/cashier/pos` - POS kasir.
- `/cashier/transaksi` - riwayat transaksi kasir.
- `/cashier/pengaturan` - pengaturan kasir.

## API Penting

- `/api/auth/[...all]` - endpoint Better Auth.
- `/api/barang` - data barang admin.
- `/api/kategori` - data kategori.
- `/api/transaksi` - transaksi admin.
- `/api/kasir/barang` - data barang untuk kasir.
- `/api/kasir/transaksi` - transaksi dari kasir.
- `/api/laporan/kas` - laporan kas.
- `/api/laporan/kasir` - laporan kasir.
- `/api/laporan/penjualan` - laporan penjualan.
- `/api/laporan/stok` - laporan stok.
- `/api/uploadthing` - upload gambar barang.

## Script NPM

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:create-admin
```

## Validasi

Sebelum deploy atau membuat perubahan besar, jalankan:

```bash
npm run lint
npm run typecheck
npm run build
```
