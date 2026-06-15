# Warung Mama Nia POS

Aplikasi _point of sale_ untuk warung sembako Mama Nia berbasis Next.js. Aplikasi ini mendukung pengelolaan barang, stok, transaksi kasir, laporan penjualan, dan akses berbasis role untuk admin serta kasir.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Memulai](#memulai)
  - [1. Setup Environment](#1-setup-environment)
  - [2. Instalasi](#2-instalasi)
  - [3. Setup Database](#3-setup-database)
  - [4. Menjalankan Aplikasi](#4-menjalankan-aplikasi)
- [Role dan Akses](#role-dan-akses)
- [Struktur Proyek](#struktur-proyek)

## Fitur Utama

- Autentikasi menggunakan Better Auth dengan role akses `admin` dan `cashier`.
- Dashboard terpisah untuk admin dan kasir.
- Manajemen barang, kategori, harga beli, harga jual, stok, dan gambar barang.
- POS untuk pencatatan transaksi penjualan.
- Riwayat transaksi serta edit transaksi oleh admin.
- Laporan kas, kasir, stok, dan penjualan.
- Audit perubahan stok melalui data `StockAdjustment`.
- Upload gambar barang menggunakan UploadThing.
- Dukungan PWA untuk pengalaman penggunaan seperti aplikasi native.

## Tech Stack

| Kategori     | Teknologi                         |
| ------------ | --------------------------------- |
| Framework    | Next.js 16 (App Router), React 19 |
| Bahasa       | TypeScript                        |
| Database     | PostgreSQL, Prisma 7              |
| Autentikasi  | Better Auth                       |
| Styling      | Tailwind CSS v4, shadcn/ui        |
| State & Data | Zustand, TanStack React Query     |
| Upload       | UploadThing                       |

## Prasyarat

- Node.js dan npm.
- Database PostgreSQL.
- Akun UploadThing jika ingin menggunakan fitur upload gambar barang.

## Memulai

### 1. Setup Environment

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

### 2. Instalasi

Install dependency (Prisma Client otomatis di-generate via `postinstall`):

```bash
npm install
```

### 3. Setup Database

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

### 4. Menjalankan Aplikasi

Jalankan server development:

```bash
npm run dev
```

Buka aplikasi di [http://localhost:3000](http://localhost:3000). Halaman root akan mengarah ke `/login`.

## Role dan Akses

- Admin diarahkan ke `/admin` dan dapat mengakses halaman admin.
- Cashier diarahkan ke `/cashier` dan dapat mengakses alur POS kasir.
- Proteksi route dikontrol dari `proxy.ts` dengan aturan path di `lib/auth-routes.ts`.

## Struktur Proyek

```text
.
├── app/          # Routing App Router, halaman, dan API routes
├── components/   # Komponen UI yang dapat digunakan ulang
├── features/     # Modul fitur (barang, pos, transaksi, laporan, dll.)
├── hooks/        # Custom React hooks
├── lib/          # Utility, auth, prisma, schema, dan logika server
├── prisma/       # Schema dan seed database
├── public/       # Aset statis
└── scripts/      # Script utilitas (mis. create-admin)
```
