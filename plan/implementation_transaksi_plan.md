# Integrasi Backend Halaman Manajemen Transaksi

Rencana ini bertujuan untuk menghubungkan UI halaman Manajemen Transaksi (`/admin/transaksi`) yang sudah selesai dibangun dengan backend REST API (menggunakan arsitektur TanStack Query dan Next.js Route Handlers).

## Proposed Changes

### Backend API
Akan membuat endpoint API baru untuk melayani data transaksi, statistik, dan aktivitas.

#### [NEW] `app/api/transaksi/route.ts`
- **Tujuan**: Endpoint `GET` untuk mengambil seluruh daftar transaksi beserta statistik dan aktivitas terbarunya.
- **Implementasi**:
  - Pengecekan otorisasi `requireAdmin()` (memastikan hanya pengguna dengan role admin yang bisa mengakses).
  - Mengambil data transaksi dari Prisma ORM dengan relasi item (`items`) dan kasir.
  - Melakukan kalkulasi statistik harian:
    - Total Transaksi Hari Ini.
    - Total Penjualan Hari Ini (khusus transaksi berstatus `COMPLETED`).
    - Jumlah Transaksi Pending (status `PENDING`).
    - Rata-rata Nilai Transaksi (Total penjualan / jumlah transaksi `COMPLETED`).
    - (Opsional: Membandingkan dengan penjualan kemarin untuk tren kenaikan/penurunan).
  - Mengonversi data mentah Prisma menjadi representasi/struktur JSON yang langsung siap dikonsumsi UI (seperti format tanggal lokal Indonesia, menggabungkan nama item transaksi, dll).

---

### Frontend Data Fetching Layer
Akan membuat custom hook untuk membungkus panggilan fetch ke API transaksi dengan TanStack Query, konsisten dengan halaman Barang.

#### [NEW] `components/transaksi/use-transaksi-queries.ts`
- **Tujuan**: Menyediakan hook `useTransactions()` dan mendefinisikan *types* TypeScript yang diperlukan.
- **Implementasi**:
  - `fetchTransaksiData`: Fungsi utilitas fetch biasa ke `/api/transaksi`.
  - `useTransactions`: Hook dari `@tanstack/react-query` untuk caching, loading state, dan sinkronisasi background.
  - Tipe `TransactionItem`, `TransactionStats`, dan `TransactionActivity`.

---

### Update UI Components
Akan memodifikasi komponen UI agar tidak lagi menggunakan data statis/mockup, tetapi merender data yang dilempar via props dari *page*.

#### [NEW] `app/admin/transaksi/loading.tsx`
- Menambahkan loading skeleton untuk transisi navigasi yang lebih mulus ketika TanStack Query pertama kali dijalankan dari sisi *client* atau saat navigasi halaman.

#### [MODIFY] `app/admin/transaksi/page.tsx`
- Menghubungkan hook `useTransactions()`.
- Menyediakan *error handling* (jika fetch gagal).
- Menurunkan/passing data *response* API (transaksi, statistik, dan aktivitas) ke child components (Tabel, Card, dll).

#### [MODIFY] `components/transaksi/transaksi-table.tsx`
- Menghapus *mock data* (`transactions` statis).
- Menerima `transactions` melalui props.
- Menyusun logika filter/pencarian agar berjalan normal pada data dinamis (filter berdasarkan Enum Prisma yang diterjemahkan, contoh: `COMPLETED` -> "Selesai", `QRIS_MANUAL` -> "QRIS").

#### [MODIFY] `components/transaksi/transaksi-stat-cards.tsx`
- Menghapus *mock data* `stats`.
- Menerima `stats` dan `trends` melalui props dan merendernya.

#### [MODIFY] `components/transaksi/transaksi-aktivitas.tsx`
- Menghapus *mock data* `activities`.
- Menerima daftar aktivitas transaksi terbaru (misal: 4 transaksi terakhir) dari API dan menampilkan ikon serta informasinya berdasarkan tipe/status transaksi.

## Verification Plan

### Automated / Manual Verification
1. Menjalankan `npm run dev`.
2. Mengunjungi halaman `/admin/transaksi` pada desktop dan perangkat mobile/tablet.
3. Memastikan **Loading UI** muncul saat *fetching* awal.
4. Memastikan tabel menampilkan data transaksi asli dari database.
5. Memastikan semua fitur filter (Status, Metode Pembayaran, Kasir) dan fitur pencarian bekerja dengan lancar.
6. Memastikan angka pada "Stat Cards" cocok dengan total agregasi data hari ini dari database.
7. Tidak ada TypeScript atau runtime error.
