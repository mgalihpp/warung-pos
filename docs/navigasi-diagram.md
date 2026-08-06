# Diagram Struktur Navigasi — Warung Sembako POS

## 1. Struktur Navigasi Linear (Sequential Navigation)

Pengguna mengikuti alur langkah demi langkah secara berurutan. Tidak ada cabang atau loncatan ke halaman lain.

```mermaid
graph LR
    A[Login] --> B[Register]
    B --> C[Dashboard]

    D[POS - Pilih Barang] --> E[Keranjang]
    E --> F[Pembayaran]
    F --> G[Selesai / Nota]
```

**Contoh dalam aplikasi:** Proses checkout POS (Pilih Barang → Keranjang → Pembayaran → Selesai) dan alur autentikasi.

---

## 2. Struktur Navigasi Non-Linear (Network Navigation)

Setiap halaman dapat diakses dari halaman mana pun tanpa urutan tetap. Pengguna memiliki kebebasan penuh menjelajah.

```mermaid
graph TD
    D[Dashboard] --- K[Kasir / POS]
    D --- B[Barang]
    D --- KT[Kategori]
    D --- T[Transaksi]
    D --- L[Laporan]
    D --- P[Pengaturan]
    K --- B
    K --- T
    B --- KT
    T --- L
    L --- P
    P --- K
```

**Contoh dalam aplikasi:** Tujuh menu utama Admin (Dashboard, Kasir, Barang, Kategori, Transaksi, Laporan, Pengaturan) — semua flat, bisa diakses kapan saja dalam urutan apa pun.

---

## 3. Struktur Navigasi Hierarkis (Hierarchical / Tree Navigation)

Struktur pohon dengan hubungan parent-child. Navigasi dilakukan dengan turun ke sub-level atau naik ke level di atasnya.

```mermaid
graph TD
    Admin[Admin Panel] --> D[Dashboard]
    Admin --> K[Kasir / POS]
    Admin --> B[Barang]
    Admin --> KT[Kategori]
    Admin --> T[Transaksi]
    Admin --> L[Laporan]
    Admin --> P[Pengaturan]
    Admin --> PG[Pengguna - Rencana]

    K ==> K1[Pilih Barang]
    K1 ==> K2[Keranjang]
    K2 ==> K3[Pembayaran]
    K3 ==> K4[Selesai]

    B --> BD[Daftar Barang]
    B --> BT[Tambah Barang]
    B --> BE[Detail Barang]
    BE --> BEE[Edit Barang]

    KT --> KTT[Tambah Kategori]
    KT --> KTE[Edit Kategori]

    T --> TD[Detail Transaksi]
    TD --> TDE[Edit Transaksi]

    L --> LP[Penjualan]
    L --> LS[Lap. Stok]
    L --> LK[Lap. Kas - Rencana]
    L --> LKR[Lap. Kasir - Rencana]

    P --> PP[Profile]
    P --> PM[Manajemen Akun]
    P --> PTA[Tambah Akun]
    P --> PT[Tema]
```

**Contoh dalam aplikasi:** Role bercabang ke Admin/Cashier, lalu tiap menu induk memiliki sub-halaman (Barang → Daftar/Tambah/Detail; Transaksi → Detail/Edit; Laporan → Penjualan/Stok/Kas/Kasir; Pengaturan → Profile/Akun/Tema).

---

## 4. Struktur Navigasi Campuran / Hybrid (Combined Navigation)

Menggabungkan elemen linear, non-linear, dan hierarkis dalam satu arsitektur. Struktur **aktual** dari Warung Sembako POS.

```mermaid
graph TD
    L[Login] --> R{Role}
    R -->|Admin| A[Admin Panel]
    R -->|Cashier| C[Cashier Panel]

    A --> S[Sidebar Navigation]
    S --> D[Dashboard]
    S --> K[Kasir / POS]
    S --> B[Barang]
    S --> KT[Kategori]
    S --> T[Transaksi]
    S --> L[Laporan]
    S --> P[Pengaturan]
    S --> PU[Pengguna - Rencana]

    K ==> K1[Pilih Barang]
    K1 ==> K2[Keranjang]
    K2 ==> K3[Pembayaran]
    K3 ==> K4[Selesai]

    B --> BD[Daftar Barang]
    B --> BT[Tambah Barang]
    B --> BE[Detail Barang]
    BE --> BEE[Edit Barang]

    KT --> KTT[Tambah Kategori]
    KT --> KTE[Edit Kategori]

    T --> TD[Detail Transaksi]
    TD --> TDE[Edit Transaksi]

    L --> LP[Penjualan]
    L --> LS[Lap. Stok]
    L --> LK[Lap. Kas - Rencana]
    L --> LKR[Lap. Kasir - Rencana]

    P --> PP[Profile]
    P --> PM[Manajemen Akun]
    P --> PTA[Tambah Akun]
    P --> PT[Tema]

    C --> CK[Kasir / POS]
    C --> CR[Riwayat Transaksi]
    CR --> CRD[Detail Transaksi]
    C --> CP[Pengaturan]
    CP --> CPT[Tema]
```

**Tiga tipe dalam satu arsitektur (~38 halaman):**
| Tipe | Bagian | Penjelasan |
|---|---|---|
| **Hierarkis** | Role branch + sub-halaman | Login → Admin / Cashier; tiap menu induk punya anak (Barang → Daftar/Tambah/Detail/Edit; Transaksi → Detail/Edit) |
| **Non-Linear** | Sidebar 7 menu + Cashier 3 menu | Sidebar persisten — dari halaman anak mana pun bisa lompat ke menu utama mana pun |
| **Linear** | POS checkout | Kasir → Pilih Barang → Keranjang → Pembayaran → Selesai (wajib berurutan) |

---

## Ringkasan

| Tipe Struktur | Karakteristik | Ada di Aplikasi |
|---|---|---|
| **Linear** | Berurutan, satu arah | Checkout POS, autentikasi |
| **Non-Linear** | Bebas, semua terhubung | Menu utama Admin & Cashier |
| **Hierarkis** | Pohon, parent-child | Laporan, Pengaturan, Barang |
| **Hybrid/Campuran** | Gabungan ketiganya | **Keseluruhan aplikasi** |
