# Use Case Diagram Aplikasi Warung Sembako POS

Dokumen ini berisi use case diagram untuk Bab 3. Setiap diagram tersedia dalam
format PlantUML dan Mermaid.js. Notasi menggunakan relasi:

- **`<<include>>`** : use case wajib dijalankan oleh use case utama (tidak berdiri sendiri).
- **`<<extend>>`** : use case opsional yang dijalankan hanya dalam kondisi tertentu.

Aktor:

- **Pengguna** – aktor dasar (generalisasi dari Admin dan Kasir).
- **Admin** – dapat mengakses seluruh modul manajemen serta modul kasir.
- **Kasir** – hanya dapat mengakses modul POS, riwayat transaksinya sendiri, dan pengaturan pribadi.

---

## 1. Use Case Diagram — Versi PlantUML

```plantuml
@startuml
left to right direction
skinparam shadowing false
skinparam packageStyle rectangle

actor "Pengguna" as Pengguna
actor "Admin" as Admin
actor "Kasir" as Kasir

Pengguna <|-- Admin
Pengguna <|-- Kasir

rectangle "Warung Sembako POS" {

  ' ---- Use cases umum (login / pengaturan pribadi) ----
  usecase "Login" as UC01
  usecase "Logout" as UC02
  usecase "Mengubah Tema Aplikasi" as UC03
  usecase "Mengelola Profil" as UC04
  usecase "Memperbarui Profil" as UC05
  usecase "Mengubah Kata Sandi" as UC06
  usecase "Mengunggah Foto Profil" as UC07

  ' ---- Use cases admin ----
  usecase "Melihat Dashboard" as UC08
  usecase "Melihat Notifikasi Stok" as UC09
  usecase "Mengelola Barang" as UC10
  usecase "Menambah Barang" as UC11
  usecase "Mengedit Barang" as UC12
  usecase "Menghapus / Menonaktifkan Barang" as UC13
  usecase "Menyesuaikan Stok Barang" as UC14
  usecase "Mengelola Kategori" as UC15
  usecase "Menambah Kategori" as UC16
  usecase "Mengedit Kategori" as UC17
  usecase "Menghapus Kategori" as UC18
  usecase "Mengelola Akun Pengguna" as UC19
  usecase "Membuat Akun" as UC20
  usecase "Mengubah Akses Akun" as UC21
  usecase "Menghapus Akun" as UC22
  usecase "Melihat Laporan" as UC23
  usecase "Laporan Penjualan" as UC24
  usecase "Laporan Stok" as UC25
  usecase "Laporan Kas" as UC26
  usecase "Laporan Kinerja Kasir" as UC27
  usecase "Mengekspor Laporan" as UC28

  ' ---- Use cases POS / transaksi ----
  usecase "Proses Penjualan POS" as UC29
  usecase "Memilih & Mencari Barang" as UC30
  usecase "Mengelola Keranjang" as UC31
  usecase "Memproses Pembayaran" as UC32
  usecase "Menampilkan Struk" as UC33
  usecase "Melihat Riwayat Transaksi" as UC34
  usecase "Melihat Detail Transaksi" as UC35
  usecase "Mengedit Transaksi" as UC36
  usecase "Mengubah Status Transaksi" as UC37
  usecase "Menghapus Transaksi" as UC38

  ' ---- Relasi aktor ke use case ----
  Admin --> UC08
  Admin --> UC09
  Admin --> UC10
  Admin --> UC15
  Admin --> UC19
  Admin --> UC23
  Admin --> UC29
  Admin --> UC34
  Admin --> UC03
  Admin --> UC04
  Admin --> UC01
  Admin --> UC02

  Kasir --> UC29
  Kasir --> UC34
  Kasir --> UC03
  Kasir --> UC04
  Kasir --> UC01
  Kasir --> UC02

  ' ---- Include : umum ----
  UC04 ..> UC05 : <<include>>
  UC04 ..> UC06 : <<include>>
  UC04 ..> UC07 : <<include>>

  ' ---- Include : barang & kategori ----
  UC10 ..> UC11 : <<include>>
  UC10 ..> UC12 : <<include>>
  UC10 ..> UC13 : <<include>>
  UC10 ..> UC14 : <<include>>
  UC15 ..> UC16 : <<include>>
  UC15 ..> UC17 : <<include>>
  UC15 ..> UC18 : <<include>>

  ' ---- Include : akun pengguna ----
  UC19 ..> UC20 : <<include>>
  UC19 ..> UC21 : <<include>>
  UC19 ..> UC22 : <<include>>

  ' ---- Include : laporan ----
  UC23 ..> UC24 : <<include>>
  UC23 ..> UC25 : <<include>>
  UC23 ..> UC26 : <<include>>
  UC23 ..> UC27 : <<include>>

  ' ---- Include : POS & transaksi ----
  UC29 ..> UC30 : <<include>>
  UC29 ..> UC31 : <<include>>
  UC29 ..> UC32 : <<include>>
  UC34 ..> UC35 : <<include>>

  ' ---- Extend : opsional / bersyarat ----
  UC32 ..> UC33 : <<extend>>
  UC35 ..> UC36 : <<extend>>
  UC35 ..> UC37 : <<extend>>
  UC35 ..> UC38 : <<extend>>
  UC24 ..> UC28 : <<extend>>
}
@enduml
```

---

## 2. Use Case Diagram — Versi Mermaid.js

```mermaid
flowchart LR
  Pengguna(("Pengguna"))
  Admin(("Admin"))
  Kasir(("Kasir"))

  Pengguna ---|generalisasi| Admin
  Pengguna ---|generalisasi| Kasir

  subgraph SISTEM["Warung Sembako POS"]
    UC01(("Login"))
    UC02(("Logout"))
    UC03(("Mengubah Tema Aplikasi"))
    UC04(("Mengelola Profil"))
    UC05(("Memperbarui Profil"))
    UC06(("Mengubah Kata Sandi"))
    UC07(("Mengunggah Foto Profil"))

    UC08(("Melihat Dashboard"))
    UC09(("Melihat Notifikasi Stok"))
    UC10(("Mengelola Barang"))
    UC11(("Menambah Barang"))
    UC12(("Mengedit Barang"))
    UC13(("Menghapus / Menonaktifkan Barang"))
    UC14(("Menyesuaikan Stok Barang"))
    UC15(("Mengelola Kategori"))
    UC16(("Menambah Kategori"))
    UC17(("Mengedit Kategori"))
    UC18(("Menghapus Kategori"))
    UC19(("Mengelola Akun Pengguna"))
    UC20(("Membuat Akun"))
    UC21(("Mengubah Akses Akun"))
    UC22(("Menghapus Akun"))
    UC23(("Melihat Laporan"))
    UC24(("Laporan Penjualan"))
    UC25(("Laporan Stok"))
    UC26(("Laporan Kas"))
    UC27(("Laporan Kinerja Kasir"))
    UC28(("Mengekspor Laporan"))

    UC29(("Proses Penjualan POS"))
    UC30(("Memilih & Mencari Barang"))
    UC31(("Mengelola Keranjang"))
    UC32(("Memproses Pembayaran"))
    UC33(("Menampilkan Struk"))
    UC34(("Melihat Riwayat Transaksi"))
    UC35(("Melihat Detail Transaksi"))
    UC36(("Mengedit Transaksi"))
    UC37(("Mengubah Status Transaksi"))
    UC38(("Menghapus Transaksi"))
  end

  Admin --> UC08
  Admin --> UC09
  Admin --> UC10
  Admin --> UC15
  Admin --> UC19
  Admin --> UC23
  Admin --> UC29
  Admin --> UC34
  Admin --> UC03
  Admin --> UC04
  Admin --> UC01
  Admin --> UC02

  Kasir --> UC29
  Kasir --> UC34
  Kasir --> UC03
  Kasir --> UC04
  Kasir --> UC01
  Kasir --> UC02

  UC04 -. include .-> UC05
  UC04 -. include .-> UC06
  UC04 -. include .-> UC07

  UC10 -. include .-> UC11
  UC10 -. include .-> UC12
  UC10 -. include .-> UC13
  UC10 -. include .-> UC14
  UC15 -. include .-> UC16
  UC15 -. include .-> UC17
  UC15 -. include .-> UC18

  UC19 -. include .-> UC20
  UC19 -. include .-> UC21
  UC19 -. include .-> UC22

  UC23 -. include .-> UC24
  UC23 -. include .-> UC25
  UC23 -. include .-> UC26
  UC23 -. include .-> UC27

  UC29 -. include .-> UC30
  UC29 -. include .-> UC31
  UC29 -. include .-> UC32
  UC34 -. include .-> UC35

  UC32 -. extend .-> UC33
  UC35 -. extend .-> UC36
  UC35 -. extend .-> UC37
  UC35 -. extend .-> UC38
  UC24 -. extend .-> UC28
```

---

## 3. Penjelasan Relasi

| No | Use Case Utama | Relasi | Use Case Terkait | Alasan |
|----|----------------|--------|------------------|--------|
| 1 | Mengelola Profil | `<<include>>` | Memperbarui Profil, Mengubah Kata Sandi, Mengunggah Foto Profil | Ketiganya selalu dijalankan dalam menu pengaturan profil. |
| 2 | Mengelola Barang | `<<include>>` | Menambah, Mengedit, Menghapus, Menyesuaikan Stok | Semua operasi CRUD adalah bagian tak terpisahkan dari pengelolaan barang. |
| 3 | Mengelola Kategori | `<<include>>` | Menambah, Mengedit, Menghapus Kategori | Operasi dasar pengelolaan kategori. |
| 4 | Mengelola Akun Pengguna | `<<include>>` | Membuat, Mengubah Akses, Menghapus Akun | Alur pengelolaan akun selalu melalui operasi ini. |
| 5 | Melihat Laporan | `<<include>>` | Laporan Penjualan, Stok, Kas, Kinerja Kasir | Melihat laporan berarti melihat salah satu dari keempat laporan. |
| 6 | Proses Penjualan POS | `<<include>>` | Memilih & Mencari Barang, Mengelola Keranjang, Memproses Pembayaran | Penjualan tidak selesai tanpa ketiga langkah ini. |
| 7 | Melihat Riwayat Transaksi | `<<include>>` | Melihat Detail Transaksi | Detail dibuka dari daftar riwayat transaksi. |
| 8 | Memproses Pembayaran | `<<extend>>` | Menampilkan Struk | Struk hanya muncul setelah pembayaran berhasil (opsional/bersyarat). |
| 9 | Melihat Detail Transaksi | `<<extend>>` | Mengedit, Mengubah Status, Menghapus Transaksi | Aksi-aksi ini hanya tersedia secara opsional dari halaman detail (admin). |
| 10 | Laporan Penjualan | `<<extend>>` | Mengekspor Laporan | Ekspor CSV hanya dijalankan jika admin memilih untuk mengunduh. |

> Catatan: Berdasarkan kode (`lib/auth-routes.ts`), Admin juga dapat mengakses seluruh
> halaman kasir (`/cashier/*`), sehingga Admin diberi akses ke use case POS dan
> riwayat transaksi. Aktor **Pengguna** hanya sebagai generalisasi, bukan akun yang
> benar-benar dapat login (pendaftaran akun dilakukan oleh Admin, lihat `app/register/page.tsx`).
