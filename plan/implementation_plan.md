# Dashboard POS Warung Sembako

Membuat halaman dashboard utama sesuai dengan screenshot yang diberikan. Dashboard memiliki layout 3-column: sidebar navigasi (kiri), konten utama (tengah), dan panel informasi (kanan).

## Proposed Changes

### Layout & Sidebar

#### [MODIFY] [layout.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/app/admin/layout.tsx)
- Buat layout admin baru dengan `SidebarProvider` + `Sidebar` + `SidebarInset`
- Sidebar hijau (#1B8332) berisi:
  - Logo "POS Warung Sembako" + ikon keranjang
  - Menu navigasi: Dashboard, Kasir, Produk, Stok, Transaksi, Pelanggan, Laporan, Pengaturan
  - Card promo "Kelola warung lebih mudah..."
  - Footer: versi v1.0.0

#### [NEW] [app-sidebar.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/app-sidebar.tsx)
- Komponen sidebar navigasi kustom dengan tema hijau
- Menu items dengan ikon dari `@hugeicons`
- Active state pada "Dashboard"

---

### Top Bar

#### [NEW] [dashboard-header.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/dashboard-header.tsx)
- Search bar dengan placeholder "Cari produk, transaksi, pelanggan..."
- Keyboard shortcut badge `Ctrl + K`
- Tanggal hari ini (formatted Indonesia)
- Bell notification icon dengan badge
- User avatar + nama "Budi Warung" + role "Pemilik"

---

### Stats Cards (4 buah)

#### [NEW] [stat-cards.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/stat-cards.tsx)
- **Penjualan Hari Ini**: Rp 2.450.000 (△12.5%)
- **Jumlah Transaksi**: 86 (△8.7%)
- **Penjualan Bulanan**: Rp 78.650.000 (△15.3%)
- **Produk Hampir Habis**: 5 (warning)
- Masing-masing dengan ikon berwarna dan badge persentase

---

### Charts Area

#### [NEW] [sales-chart.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/sales-chart.tsx)
- Bar chart "Grafik Penjualan" menggunakan Recharts
- Data 7 hari terakhir dengan gradient bars hijau
- Tooltip interaktif

#### [NEW] [category-chart.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/category-chart.tsx)
- Donut/Pie chart "Kategori Terlaris"
- Label tengah "Total Penjualan"
- Legend: Sembako 45%, Minuman 20%, Mie Instan 15%, Bumbu & Dapur 10%, Lainnya 10%

---

### Quick Actions & Payment Methods

#### [NEW] [quick-actions.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/quick-actions.tsx)
- Tombol "Tambah Transaksi" (hijau, prominent)
- Tombol "Cetak Struk" dan "Tambah Produk"
- Section "Metode Pembayaran" (Tunai, QRIS, Transfer) dengan breakdown persentase

---

### Recent Transactions

#### [NEW] [recent-transactions.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/recent-transactions.tsx)
- Tabel 5 transaksi terbaru
- Kolom: No, Waktu, Kasir (avatar+nama), Item, Total, Status
- Status badge (Selesai=hijau, Pending=kuning)
- Link "Lihat Semua Transaksi"

---

### Right Panel

#### [NEW] [low-stock-panel.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/low-stock-panel.tsx)
- "Stok Menipis" dengan badge jumlah (5)
- List produk: gambar, nama, sisa stok, badge warna
- Link "Lihat Semua"

#### [NEW] [best-sellers-panel.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/components/dashboard/best-sellers-panel.tsx)
- "Produk Terlaris" 
- List produk: ranking, gambar, nama, jumlah terjual, total penjualan
- Link "Lihat Semua"

---

### Dashboard Page

#### [MODIFY] [page.tsx](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/app/admin/page.tsx)
- Compose semua komponen di atas ke dalam layout grid 
- Responsive grid: main content + right panel

---

### Styling

#### [MODIFY] [globals.css](file:///d:/Download/Documents/gunadarma/gundar/PI/aplikasi/warung-sembako-pos/app/globals.css)
- Tambah custom CSS variables untuk warna hijau POS
- Custom sidebar styling (background hijau, text putih pada active state)

---

### Product Images

Akan generate gambar produk (beras, gula pasir, minyak goreng, telur, mie instan) untuk ditampilkan di panel stok menipis dan produk terlaris.

## Verification Plan

### Automated Tests
- Jalankan `npm run dev` dan buka halaman `/admin` di browser
- Verifikasi visual layout matching dengan screenshot
- Cek responsivitas pada berbagai ukuran layar

### Manual Verification
- Bandingkan visual dashboard dengan screenshot yang diberikan
- Pastikan semua komponen render dengan benar
- Verifikasi chart interaktif (tooltip, hover effects)
