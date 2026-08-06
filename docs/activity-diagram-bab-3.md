# Activity Diagram Aplikasi Warung Mama Nia POS

Dokumen ini berisi versi sederhana activity diagram untuk Bab 3. Setiap diagram tersedia dalam format PlantUML dan Mermaid.js.

## 1. Activity Diagram Login

### PlantUML

```plantuml
@startuml
title Activity Diagram Login

start
:User membuka aplikasi;
:Sistem menampilkan halaman login;
:User memasukkan email dan password;
:Sistem memvalidasi data login;

if (Login valid?) then (Ya)
  :Sistem mengecek role user;
  if (Admin?) then (Ya)
    :Masuk ke Dashboard Admin;
  else (Kasir)
    :Masuk ke Halaman POS Kasir;
  endif
else (Tidak)
  :Tampilkan pesan login gagal;
endif

stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[User membuka aplikasi]
  B --> C[Sistem menampilkan halaman login]
  C --> D[User memasukkan email dan password]
  D --> E[Sistem memvalidasi data login]
  E --> F{Login valid?}
  F -- Tidak --> G[Tampilkan pesan login gagal]
  F -- Ya --> H[Sistem mengecek role user]
  H --> I{Admin?}
  I -- Ya --> J[Masuk ke Dashboard Admin]
  I -- Tidak --> K[Masuk ke Halaman POS Kasir]
  G --> L([Selesai])
  J --> L
  K --> L
```

## 2. Activity Diagram Transaksi POS

### PlantUML

```plantuml
@startuml
title Activity Diagram Transaksi POS

start
:Kasir membuka halaman POS;
:Sistem menampilkan daftar produk;
:Kasir memilih produk;
:Produk masuk ke keranjang;
:Kasir memilih metode pembayaran;
:Kasir melakukan pembayaran;
:Sistem memvalidasi transaksi;

if (Transaksi valid?) then (Ya)
  :Sistem menyimpan transaksi;
  :Sistem mengurangi stok produk;
  :Sistem menampilkan struk;
else (Tidak)
  :Tampilkan pesan gagal transaksi;
endif

stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Kasir membuka halaman POS]
  B --> C[Sistem menampilkan daftar produk]
  C --> D[Kasir memilih produk]
  D --> E[Produk masuk ke keranjang]
  E --> F[Kasir memilih metode pembayaran]
  F --> G[Kasir melakukan pembayaran]
  G --> H[Sistem memvalidasi transaksi]
  H --> I{Transaksi valid?}
  I -- Ya --> J[Sistem menyimpan transaksi]
  J --> K[Sistem mengurangi stok produk]
  K --> L[Sistem menampilkan struk]
  I -- Tidak --> M[Tampilkan pesan gagal transaksi]
  L --> N([Selesai])
  M --> N
```

## 3. Activity Diagram Kelola Produk

### PlantUML

```plantuml
@startuml
title Activity Diagram Kelola Produk

start
:Admin membuka halaman produk;
:Sistem menampilkan daftar produk;
:Admin memilih aksi;

if (Tambah produk?) then (Ya)
  :Admin mengisi form produk;
  :Sistem menyimpan produk baru;
elseif (Edit produk?) then (Ya)
  :Admin mengubah data produk;
  :Sistem memperbarui produk;
else (Lihat detail)
  :Sistem menampilkan detail produk;
endif

:Sistem menampilkan data produk terbaru;
stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Admin membuka halaman produk]
  B --> C[Sistem menampilkan daftar produk]
  C --> D{Admin memilih aksi}
  D -- Tambah produk --> E[Admin mengisi form produk]
  E --> F[Sistem menyimpan produk baru]
  D -- Edit produk --> G[Admin mengubah data produk]
  G --> H[Sistem memperbarui produk]
  D -- Lihat detail --> I[Sistem menampilkan detail produk]
  F --> J[Sistem menampilkan data produk terbaru]
  H --> J
  I --> J
  J --> K([Selesai])
```

## 4. Activity Diagram Kelola Kategori

### PlantUML

```plantuml
@startuml
title Activity Diagram Kelola Kategori

start
:Admin membuka halaman kategori;
:Sistem menampilkan daftar kategori;
:Admin memilih aksi;

if (Tambah kategori?) then (Ya)
  :Admin mengisi form kategori;
  :Sistem menyimpan kategori baru;
else (Edit kategori)
  :Admin mengubah data kategori;
  :Sistem memperbarui kategori;
endif

:Sistem menampilkan data kategori terbaru;
stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Admin membuka halaman kategori]
  B --> C[Sistem menampilkan daftar kategori]
  C --> D{Admin memilih aksi}
  D -- Tambah kategori --> E[Admin mengisi form kategori]
  E --> F[Sistem menyimpan kategori baru]
  D -- Edit kategori --> G[Admin mengubah data kategori]
  G --> H[Sistem memperbarui kategori]
  F --> I[Sistem menampilkan data kategori terbaru]
  H --> I
  I --> J([Selesai])
```

## 5. Activity Diagram Kelola Transaksi

### PlantUML

```plantuml
@startuml
title Activity Diagram Kelola Transaksi

start
:User membuka halaman transaksi;
:Sistem menampilkan daftar transaksi;
:User mencari atau memilih transaksi;
:Sistem menampilkan detail transaksi;

if (Admin ingin mengedit?) then (Ya)
  :Admin mengubah data transaksi;
  :Sistem memperbarui transaksi;
else (Tidak)
  :User kembali ke daftar transaksi;
endif

stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[User membuka halaman transaksi]
  B --> C[Sistem menampilkan daftar transaksi]
  C --> D[User mencari atau memilih transaksi]
  D --> E[Sistem menampilkan detail transaksi]
  E --> F{Admin ingin mengedit?}
  F -- Ya --> G[Admin mengubah data transaksi]
  G --> H[Sistem memperbarui transaksi]
  F -- Tidak --> I[User kembali ke daftar transaksi]
  H --> J([Selesai])
  I --> J
```

## 6. Activity Diagram Dashboard

### PlantUML

```plantuml
@startuml
title Activity Diagram Dashboard

start
:Admin membuka dashboard;
:Sistem mengambil data penjualan, transaksi, dan stok;
:Sistem menampilkan statistik dan grafik;

if (Ada stok menipis?) then (Ya)
  :Sistem menampilkan notifikasi stok;
else (Tidak)
  :Dashboard tampil normal;
endif

:Admin melihat informasi dashboard;
stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Admin membuka dashboard]
  B --> C[Sistem mengambil data penjualan, transaksi, dan stok]
  C --> D[Sistem menampilkan statistik dan grafik]
  D --> E{Ada stok menipis?}
  E -- Ya --> F[Sistem menampilkan notifikasi stok]
  E -- Tidak --> G[Dashboard tampil normal]
  F --> H[Admin melihat informasi dashboard]
  G --> H
  H --> I([Selesai])
```

## 7. Activity Diagram Laporan

### PlantUML

```plantuml
@startuml
title Activity Diagram Laporan

start
:Admin membuka halaman laporan;
:Sistem menampilkan pilihan laporan;
:Admin memilih jenis laporan;
:Sistem mengambil data laporan;
:Sistem menampilkan laporan;
:Admin melihat hasil laporan;
stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Admin membuka halaman laporan]
  B --> C[Sistem menampilkan pilihan laporan]
  C --> D[Admin memilih jenis laporan]
  D --> E[Sistem mengambil data laporan]
  E --> F[Sistem menampilkan laporan]
  F --> G[Admin melihat hasil laporan]
  G --> H([Selesai])
```

## 8. Activity Diagram Lengkap Sederhana Admin

Diagram ini menggambarkan alur lengkap sisi admin, mulai dari login, dashboard, pengelolaan data, transaksi, laporan, akun, sampai POS.

### PlantUML

```plantuml
@startuml
title Activity Diagram Lengkap Sederhana Admin

start
:Admin membuka aplikasi;
:Sistem menampilkan halaman login;
:Admin memasukkan email dan password;
:Sistem memvalidasi login;

if (Login valid dan role admin?) then (Ya)
  :Admin masuk ke dashboard;
  :Sistem menampilkan ringkasan penjualan, transaksi, stok menipis, dan grafik;
  :Admin memilih menu;

  if (Menu Produk?) then (Produk)
    :Admin melihat daftar produk;
    :Admin menambah, mengubah, atau melihat detail produk;
    :Sistem menyimpan data produk;
    :Sistem memperbarui stok dan data produk;
  elseif (Menu Kategori?) then (Kategori)
    :Admin melihat daftar kategori;
    :Admin menambah atau mengubah kategori;
    :Sistem menyimpan data kategori;
  elseif (Menu Transaksi?) then (Transaksi)
    :Admin melihat daftar transaksi;
    :Admin mencari, melihat detail, atau mengubah transaksi;
    :Sistem menyimpan perubahan transaksi;
  elseif (Menu Laporan?) then (Laporan)
    :Admin memilih jenis laporan;
    :Sistem mengambil data laporan penjualan, stok, kas, atau kasir;
    :Sistem menampilkan hasil laporan;
  elseif (Menu Akun?) then (Akun)
    :Admin melihat daftar pengguna;
    :Admin menambah atau mengubah akun admin/kasir;
    :Sistem menyimpan data akun;
  elseif (Menu POS?) then (POS)
    :Admin membuka halaman POS;
    :Admin memilih produk dan metode pembayaran;
    :Sistem menyimpan transaksi dan mengurangi stok;
    :Sistem menampilkan struk;
  else (Pengaturan)
    :Admin membuka pengaturan akun atau tema;
    :Sistem menampilkan halaman pengaturan;
  endif
else (Tidak)
  :Sistem menampilkan pesan login gagal atau akses ditolak;
endif

stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Admin membuka aplikasi]
  B --> C[Sistem menampilkan halaman login]
  C --> D[Admin memasukkan email dan password]
  D --> E[Sistem memvalidasi login]
  E --> F{Login valid dan role admin?}
  F -- Tidak --> G[Sistem menampilkan pesan login gagal atau akses ditolak]
  G --> Z([Selesai])
  F -- Ya --> H[Admin masuk ke dashboard]
  H --> I[Sistem menampilkan ringkasan penjualan, transaksi, stok menipis, dan grafik]
  I --> J[Admin memilih menu]
  J --> K{Menu yang dipilih?}
  K -- Produk --> L[Admin melihat daftar produk]
  L --> M[Admin menambah, mengubah, atau melihat detail produk]
  M --> N[Sistem menyimpan data produk]
  N --> O[Sistem memperbarui stok dan data produk]
  K -- Kategori --> P[Admin melihat daftar kategori]
  P --> Q[Admin menambah atau mengubah kategori]
  Q --> R[Sistem menyimpan data kategori]
  K -- Transaksi --> S[Admin melihat daftar transaksi]
  S --> T[Admin mencari, melihat detail, atau mengubah transaksi]
  T --> U[Sistem menyimpan perubahan transaksi]
  K -- Laporan --> V[Admin memilih jenis laporan]
  V --> W[Sistem mengambil data laporan penjualan, stok, kas, atau kasir]
  W --> X[Sistem menampilkan hasil laporan]
  K -- Akun --> Y[Admin melihat daftar pengguna]
  Y --> AA[Admin menambah atau mengubah akun admin/kasir]
  AA --> AB[Sistem menyimpan data akun]
  K -- POS --> AC[Admin membuka halaman POS]
  AC --> AD[Admin memilih produk dan metode pembayaran]
  AD --> AE[Sistem menyimpan transaksi dan mengurangi stok]
  AE --> AF[Sistem menampilkan struk]
  K -- Pengaturan --> AG[Admin membuka pengaturan akun atau tema]
  AG --> AH[Sistem menampilkan halaman pengaturan]
  O --> Z
  R --> Z
  U --> Z
  X --> Z
  AB --> Z
  AF --> Z
  AH --> Z
```

## 9. Activity Diagram Lengkap Sederhana Kasir

Diagram ini menggambarkan alur lengkap sisi kasir, mulai dari login, transaksi POS, riwayat transaksi, sampai pengaturan.

### PlantUML

```plantuml
@startuml
title Activity Diagram Lengkap Sederhana Kasir

start
:Kasir membuka aplikasi;
:Sistem menampilkan halaman login;
:Kasir memasukkan email dan password;
:Sistem memvalidasi login;

if (Login valid dan role kasir?) then (Ya)
  :Kasir masuk ke halaman POS;
  :Kasir memilih menu;

  if (Menu POS?) then (POS)
    :Sistem menampilkan daftar produk dan kategori;
    :Kasir mencari atau memilih produk;
    :Sistem menambahkan produk ke keranjang;
    :Kasir mengatur jumlah produk;
    :Kasir memilih metode pembayaran;
    :Sistem menghitung total pembayaran;
    :Kasir menekan tombol bayar;
    :Sistem memvalidasi stok dan pembayaran;

    if (Transaksi valid?) then (Ya)
      :Sistem menyimpan transaksi;
      :Sistem mengurangi stok produk;
      :Sistem mencatat riwayat stok keluar;
      :Sistem menampilkan struk transaksi;
      :Keranjang dikosongkan;
    else (Tidak)
      :Sistem menampilkan pesan gagal transaksi;
      :Kasir memperbaiki keranjang atau pembayaran;
    endif
  elseif (Menu Riwayat Transaksi?) then (Riwayat)
    :Kasir membuka riwayat transaksi;
    :Sistem menampilkan transaksi milik kasir;
    :Kasir mencari atau memilih transaksi;
    :Sistem menampilkan detail transaksi;
  else (Pengaturan)
    :Kasir membuka pengaturan;
    :Kasir mengubah akun atau tema;
    :Sistem menyimpan pengaturan;
  endif
else (Tidak)
  :Sistem menampilkan pesan login gagal atau akses ditolak;
endif

stop
@enduml
```

### Mermaid.js

```mermaid
flowchart TD
  A([Mulai]) --> B[Kasir membuka aplikasi]
  B --> C[Sistem menampilkan halaman login]
  C --> D[Kasir memasukkan email dan password]
  D --> E[Sistem memvalidasi login]
  E --> F{Login valid dan role kasir?}
  F -- Tidak --> G[Sistem menampilkan pesan login gagal atau akses ditolak]
  G --> Z([Selesai])
  F -- Ya --> H[Kasir masuk ke halaman POS]
  H --> I[Kasir memilih menu]
  I --> J{Menu yang dipilih?}
  J -- POS --> K[Sistem menampilkan daftar produk dan kategori]
  K --> L[Kasir mencari atau memilih produk]
  L --> M[Sistem menambahkan produk ke keranjang]
  M --> N[Kasir mengatur jumlah produk]
  N --> O[Kasir memilih metode pembayaran]
  O --> P[Sistem menghitung total pembayaran]
  P --> Q[Kasir menekan tombol bayar]
  Q --> R[Sistem memvalidasi stok dan pembayaran]
  R --> S{Transaksi valid?}
  S -- Ya --> T[Sistem menyimpan transaksi]
  T --> U[Sistem mengurangi stok produk]
  U --> V[Sistem mencatat riwayat stok keluar]
  V --> W[Sistem menampilkan struk transaksi]
  W --> X[Keranjang dikosongkan]
  X --> Z
  S -- Tidak --> Y[Sistem menampilkan pesan gagal transaksi]
  Y --> AA[Kasir memperbaiki keranjang atau pembayaran]
  AA --> Q
  J -- Riwayat Transaksi --> AB[Kasir membuka riwayat transaksi]
  AB --> AC[Sistem menampilkan transaksi milik kasir]
  AC --> AD[Kasir mencari atau memilih transaksi]
  AD --> AE[Sistem menampilkan detail transaksi]
  AE --> Z
  J -- Pengaturan --> AF[Kasir membuka pengaturan]
  AF --> AG[Kasir mengubah akun atau tema]
  AG --> AH[Sistem menyimpan pengaturan]
  AH --> Z
```

## Catatan

Bagian 8 dan 9 adalah versi yang disarankan untuk Bab 3 jika ingin activity diagram yang lengkap tetapi tetap sederhana dan dipisahkan berdasarkan role admin dan kasir.
