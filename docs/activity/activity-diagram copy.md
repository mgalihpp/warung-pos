# Activity Diagram — Warung Sembako POS

Setiap diagram menggunakan **swimlane** untuk memisahkan interaksi antara
**Aktor**, **Sistem**, dan **Database**. Notasi PlantUML standar
(`start`, aktivitas, `if/else` decision, `fork/join`, `stop`).

---

## 1. Login

```plantuml
@startuml
|Aktor|
|Sistem|
|Database|
|Aktor|
start
:Buka halaman login;
:Input email & password;
:Klik tombol Login;
|Sistem|
:Validasi format input;
if (Input valid?) then (tidak)
  |Aktor|
  :Lihat pesan error;
  stop
else (ya)
  |Database|
  :Cek data user & password;
  |Sistem|
  if (Kredensial cocok?) then (tidak)
    |Aktor|
    :Lihat pesan gagal login;
    stop
  else (ya)
    |Database|
    :Buat session;
    |Sistem|
    if (Role = Admin?) then (ya)
      :Arahkan ke Dashboard Admin;
    else (Kasir)
      :Arahkan ke halaman POS;
    endif
    |Aktor|
    :Masuk ke aplikasi;
    stop
  endif
endif
@enduml
```

---

## 2. Mengelola Barang (Tambah / Edit / Hapus)

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Barang;
|Database|
:Ambil daftar barang;
|Sistem|
:Tampilkan daftar barang;
|Admin|
:Pilih aksi (Tambah/Edit/Hapus);
if (Aksi?) then (Tambah / Edit)
  :Isi form barang;
  :Simpan;
  |Sistem|
  if (Data valid?) then (tidak)
    |Admin|
    :Lihat pesan error;
    stop
  else (ya)
    |Database|
    :Simpan / perbarui data barang;
  endif
else (Hapus)
  |Admin|
  :Konfirmasi hapus;
  |Database|
  :Hapus data barang;
endif
|Sistem|
:Tampilkan daftar terbaru;
|Admin|
:Selesai;
stop
@enduml
```

---

## 3. Mengelola Kategori

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Kategori;
|Database|
:Ambil daftar kategori;
|Sistem|
:Tampilkan daftar kategori;
|Admin|
:Pilih aksi (Tambah/Edit/Hapus);
if (Aksi?) then (Tambah / Edit)
  :Isi nama kategori;
  :Simpan;
  |Sistem|
  if (Nama valid?) then (tidak)
    |Admin|
    :Lihat pesan error;
    stop
  else (ya)
    |Database|
    :Simpan / perbarui kategori;
  endif
else (Hapus)
  |Admin|
  :Konfirmasi hapus;
  |Database|
  :Hapus kategori;
endif
|Sistem|
:Perbarui daftar kategori;
|Admin|
:Selesai;
stop
@enduml
```

---

## 4. Melakukan Transaksi Penjualan (POS) — Kasir

```plantuml
@startuml
|Kasir|
|Sistem|
|Database|
|Kasir|
start
:Buka halaman POS;
|Database|
:Ambil daftar barang aktif;
|Sistem|
:Tampilkan produk;
|Kasir|
repeat
  :Pilih produk & tambah ke keranjang;
repeat while (Tambah produk lagi?) is (ya)
->tidak;
:Klik Bayar;
:Input jumlah uang & metode bayar;
|Sistem|
:Validasi stok & pembayaran;
if (Stok cukup & uang cukup?) then (tidak)
  |Kasir|
  :Lihat pesan error;
  stop
else (ya)
  |Database|
  fork
    :Simpan data transaksi & item;
  fork again
    :Kurangi stok barang;
  end fork
  |Sistem|
  :Buat nomor transaksi & struk;
  |Kasir|
  :Cetak / tampilkan struk;
  stop
endif
@enduml
```

---

## 5. Melihat Dashboard — Admin

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Dashboard;
|Sistem|
:Minta data ringkasan;
|Database|
fork
  :Ambil total penjualan;
fork again
  :Ambil jumlah barang & stok menipis;
fork again
  :Ambil transaksi terbaru;
end fork
|Sistem|
:Olah & tampilkan grafik/statistik;
|Admin|
:Lihat dashboard;
stop
@enduml
```

---

## 6. Melihat Laporan (Stok / Penjualan) — Admin

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Laporan;
:Pilih jenis laporan & rentang tanggal;
|Sistem|
:Kirim permintaan laporan;
|Database|
if (Jenis laporan?) then (Penjualan)
  :Ambil data transaksi sesuai tanggal;
else (Stok)
  :Ambil data stok barang;
endif
|Sistem|
:Susun laporan;
|Admin|
:Lihat / unduh laporan;
stop
@enduml
```

---

## 7. Mengelola Akun (Ubah Role) — Admin

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Kelola Akun;
|Database|
:Ambil daftar akun;
|Sistem|
:Tampilkan daftar akun;
|Admin|
:Pilih aksi (Tambah / Ubah Role);
if (Aksi?) then (Tambah)
  :Isi data akun baru;
  |Database|
  :Simpan akun baru;
else (Ubah Role)
  |Admin|
  :Pilih role baru;
  |Database|
  :Perbarui role akun;
endif
|Sistem|
:Perbarui daftar akun;
|Admin|
:Selesai;
stop
@enduml
```

---

## 8. Mengelola Profile (Ubah Profile/Password & Tema)

```plantuml
@startuml
|Aktor|
|Sistem|
|Database|
|Aktor|
start
:Buka menu Pengaturan/Profile;
:Pilih aksi;
if (Aksi?) then (Ubah Profile/Password)
  :Ubah data / password;
  :Simpan;
  |Sistem|
  if (Data valid?) then (tidak)
    |Aktor|
    :Lihat pesan error;
    stop
  else (ya)
    |Database|
    :Perbarui data profile;
  endif
else (Ubah Tema)
  |Aktor|
  :Pilih tema (terang/gelap);
  |Sistem|
  :Simpan preferensi tema;
endif
|Sistem|
:Tampilkan perubahan;
|Aktor|
:Selesai;
stop
@enduml
```

---

## 9. Riwayat Transaksi — Kasir

```plantuml
@startuml
|Kasir|
|Sistem|
|Database|
|Kasir|
start
:Buka menu Riwayat Transaksi;
|Sistem|
:Minta data transaksi kasir;
|Database|
:Ambil daftar transaksi;
|Sistem|
:Tampilkan riwayat transaksi;
|Kasir|
if (Lihat detail?) then (ya)
  :Pilih transaksi;
  |Database|
  :Ambil detail transaksi;
  |Sistem|
  :Tampilkan detail & struk;
endif
|Kasir|
:Selesai;
stop
@enduml
```

---

## 10. Logout

```plantuml
@startuml
|Aktor|
|Sistem|
|Database|
|Aktor|
start
:Klik tombol Logout;
|Sistem|
:Kirim permintaan logout;
|Database|
:Hapus session;
|Sistem|
:Arahkan ke halaman login;
|Aktor|
:Keluar dari aplikasi;
stop
@enduml
```
