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
repeat
  :Input email & password;
  :Klik tombol Masuk;
  |Database|
  :Cek email & password;
  |Sistem|
backward :Tampilkan pesan error;
repeat while (Kredensial cocok?) is (tidak) not (ya)
:Buat session;
if (Role = Admin?) then (ya)
  :Arahkan ke Dashboard Admin;
else (Kasir)
  :Arahkan ke halaman POS;
endif
|Aktor|
:Masuk ke aplikasi;
stop
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
  repeat
    :Isi form barang;
    :Klik Simpan;
    |Sistem|
    :Validasi data;
  backward :Tampilkan pesan error;
  repeat while (Data valid?) is (tidak) not (ya)
  |Database|
  :Simpan / perbarui data barang;
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
  repeat
    :Isi nama kategori;
    :Klik Simpan;
    |Sistem|
    :Validasi nama kategori;
  backward :Tampilkan pesan error;
  repeat while (Nama valid?) is (tidak) not (ya)
  |Database|
  :Simpan / perbarui kategori;
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

## 4. Melakukan Transaksi Penjualan (POS) — Kasir/Admin

> Aktor pada diagram ini dapat berupa **Kasir** maupun **Admin**, karena
> keduanya memiliki use case *Melakukan Transaksi Penjualan* dengan alur
> yang sama.

```plantuml
@startuml
|Aktor|
|Sistem|
|Database|
|Aktor|
start
:Buka halaman POS;
|Database|
:Ambil daftar barang aktif;
|Sistem|
:Tampilkan produk;
|Aktor|
repeat
  :Pilih produk & tambah ke keranjang;
repeat while (Tambah produk lagi?) is (ya)
->tidak;
:Klik Bayar;
repeat
  :Input jumlah uang & metode bayar;
  |Sistem|
  :Validasi stok & pembayaran;
backward :Tampilkan pesan error;
repeat while (Stok cukup & uang cukup?) is (tidak) not (ya)
|Sistem|
:Buat nomor transaksi;
|Database|
:Simpan data transaksi & item;
:Kurangi stok barang;
|Sistem|
:Tampilkan struk transaksi;
|Aktor|
:Lihat struk & kembalian;
stop
@enduml
```

---

## 5. Mengelola Transaksi (Detail / Edit / Hapus) — Admin

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Transaksi;
|Database|
:Ambil daftar transaksi;
|Sistem|
:Tampilkan daftar transaksi;
|Admin|
:Pilih transaksi;
if (Lihat detail?) then (ya)
  |Sistem|
  :Tampilkan detail transaksi;
  |Admin|
else (tidak)
endif
if (Aksi?) then (Edit)
  :Ubah item / metode / jumlah bayar;
  :Klik Simpan;
  |Database|
  :Perbarui transaksi & sesuaikan stok;
else (Hapus)
  |Admin|
  :Konfirmasi hapus;
  |Database|
  :Hapus transaksi & kembalikan stok;
endif
|Sistem|
:Perbarui daftar transaksi;
|Admin|
:Selesai;
stop
@enduml
```

---

## 6. Melihat Dashboard — Admin

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
  :Ambil data penjualan & jumlah transaksi;
fork again
  :Ambil daftar stok menipis;
fork again
  :Ambil transaksi terbaru & barang terlaris;
end fork
|Sistem|
:Olah & tampilkan grafik/statistik;
|Admin|
:Lihat dashboard;
stop
@enduml
```

---

## 7. Melihat Laporan (Stok / Penjualan) — Admin

```plantuml
@startuml
|Admin|
|Sistem|
|Database|
|Admin|
start
:Buka menu Laporan;
:Pilih jenis laporan & periode (7/30 hari/tahun);
|Sistem|
:Kirim permintaan laporan;
|Database|
if (Jenis laporan?) then (Penjualan)
  :Ambil data transaksi sesuai periode;
else (Stok)
  :Ambil data stok barang;
endif
|Sistem|
:Susun laporan;
|Admin|
:Lihat laporan;
stop
@enduml
```

---

## 8. Mengelola Akun (Tambah / Edit / Hapus) — Admin

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
:Pilih aksi (Tambah / Edit / Hapus);
if (Aksi?) then (Tambah / Edit)
  repeat
    :Isi / ubah data akun (nama, email, password, role, status);
    :Klik Simpan;
    |Sistem|
    :Validasi data;
  backward :Tampilkan pesan error;
  repeat while (Data valid?) is (tidak) not (ya)
  |Database|
  :Simpan / perbarui akun;
else (Hapus)
  |Admin|
  :Konfirmasi hapus;
  |Database|
  :Hapus akun;
endif
|Sistem|
:Perbarui daftar akun;
|Admin|
:Selesai;
stop
@enduml
```

---

## 9. Mengelola Profile (Ubah Profile/Password & Tema)

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
  repeat
    :Ubah data / password;
    :Klik Simpan;
    |Sistem|
    :Validasi data;
  backward :Tampilkan pesan error;
  repeat while (Data valid?) is (tidak) not (ya)
  |Database|
  :Perbarui data profile;
else (Ubah Tema)
  |Aktor|
  :Pilih tema (terang / gelap / ikuti sistem);
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

## 10. Riwayat Transaksi — Kasir

```plantuml
@startuml
|Kasir|
|Sistem|
|Database|
|Kasir|
start
:Buka menu Riwayat Transaksi;
|Sistem|
:Minta data transaksi;
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
  :Tampilkan detail transaksi;
endif
|Kasir|
:Selesai;
stop
@enduml
```

---

## 11. Logout

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
