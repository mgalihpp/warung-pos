# Dashboard Performa Warung

## Tujuan

Dashboard pemilik memprioritaskan pengolahan data transaksi menjadi laporan performa warung. Total penjualan dan keuntungan tampil sebagai ringkasan utama serta tren visual. Informasi operasional tetap dipertahankan sebagai pendukung keputusan.

## Desain

- Tambahkan ringkasan performa keuangan di bagian atas dashboard:
  - Total penjualan sesuai rentang aktif.
  - Total laba sesuai rentang aktif.
  - Margin laba sesuai rentang aktif.
- Pertahankan kartu statistik operasional yang sudah ada, termasuk penjualan hari ini, transaksi hari ini, dan stok menipis.
- Pertahankan `SalesChart` sebagai visual utama penjualan dan laba berdasarkan hari.
- Rentang `7d`, `30d`, dan `ytd` tetap mengendalikan ringkasan performa serta grafik.
- Pertahankan panel kategori produk, metode pembayaran, transaksi terbaru, produk terlaris, dan stok menipis.
- Layout tetap responsif dengan pola dashboard saat ini, tanpa Bento Grid.

## Data

- Gunakan data transaksi completed dari `getDashboardData`.
- Hitung total penjualan dari nilai `penjualan` pada `salesChart`.
- Hitung total laba dari nilai `laba` pada `salesChart`.
- Hitung margin laba sebagai `total laba / total penjualan * 100`.
- Saat total penjualan nol, tampilkan margin `0%`.

## Perilaku

- Perubahan rentang memperbarui ringkasan dan grafik melalui query dashboard yang sudah ada.
- Nilai mata uang memakai formatter Rupiah yang sudah digunakan aplikasi.
- Nilai margin memakai maksimal satu angka desimal.
- Data kosong tetap menghasilkan kartu dengan nilai nol dan grafik kosong tanpa error.

## Verifikasi

- `rtk npm run typecheck`
- `rtk npx eslint features/dashboard/components features/dashboard/server-data.ts`
- `rtk npm run build`
