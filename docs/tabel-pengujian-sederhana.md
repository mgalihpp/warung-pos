# Tabel Pengujian Black Box — Warung Mama Nia POS

**Metode:** Black-box testing (Equivalence Partitioning & Boundary Value Analysis)
**Aktor:** Admin dan Kasir

| No | Fungsi yang Diuji | Test Case | Hasil yang Diharapkan | Kesimpulan |
|---|---|---|---|---|
| 1 | Login Admin | Masuk ke website halaman admin dengan email dan password admin yang benar | Login berhasil dan diarahkan ke dashboard admin | |
| 2 | Login Kasir | Masuk ke website halaman kasir dengan email dan password kasir yang benar | Login berhasil dan diarahkan ke dashboard kasir | |
| 3 | Login gagal | Login dengan password yang salah | Login ditolak dan pesan kesalahan ditampilkan | |
| 4 | Hak akses | Kasir membuka halaman `/admin` | Akses ditolak atau diarahkan ke halaman unauthorized | |
| 5 | Logout | Logout lalu membuka halaman admin/kasir | Sesi berakhir dan halaman meminta login kembali | |
| 6 | Tambah kategori | Menambahkan kategori dengan nama dan deskripsi valid | Kategori tersimpan dan tampil pada daftar | |
| 7 | Validasi kategori | Menambah kategori dengan nama kosong | Data ditolak dan pesan nama wajib diisi tampil | |
| 8 | Duplikat kategori | Menambah kategori dengan nama yang sudah terdaftar | Duplikasi ditolak dan kategori lama tetap ada | |
| 9 | Tambah barang | Menambahkan barang dengan nama, kategori, satuan, harga, dan stok valid | Barang tersimpan dan tampil pada daftar | |
| 10 | Validasi stok | Menambah barang dengan stok -1 atau desimal 1,5 | Data ditolak, stok harus bilangan bulat ≥ 0 | |
| 11 | Validasi harga | Harga beli Rp10.000 dan harga jual Rp9.000 | Data ditolak, harga jual tidak boleh lebih kecil dari harga beli | |
| 12 | Status barang | Menonaktifkan barang | Barang tidak muncul pada katalog POS | |
| 13 | Konsistensi stok | Menjual barang sebanyak 2 | Stok berkurang tepat 2 dan audit stok tercatat | |
| 14 | Batal transaksi | Mengubah transaksi selesai menjadi dibatalkan | Stok dikembalikan sesuai jumlah transaksi | |
| 15 | Hapus transaksi | Admin menghapus transaksi selesai | Stok dikembalikan dan transaksi terhapus | |
| 16 | Keranjang stok 0 | Menambahkan barang dengan stok 0 | Barang tidak dapat ditambahkan | |
| 17 | Batas kuantitas | Stok tersedia 5 dan barang ditambah lebih dari 5 | Kuantitas maksimum tetap 5 | |
| 18 | Pembayaran tunai pas | Total Rp20.000 dan bayar Rp20.000 | Transaksi berhasil dengan kembalian Rp0 | |
| 19 | Pembayaran kurang | Total Rp20.000 dan bayar Rp15.000 | Transaksi ditolak dan kekurangan pembayaran ditampilkan | |
| 20 | Keranjang kosong | Bayar tanpa item | Transaksi tidak dapat diproses | |
| 21 | Edit transaksi | Kuantitas baru melebihi stok tersedia | Perubahan ditolak dan stok tidak menjadi negatif | |
| 22 | Detail transaksi | Membuka detail transaksi yang valid | Item, metode bayar, total, dan catatan tampil benar | |
| 23 | Hak akses kasir | Kasir menghapus transaksi | Penghapusan ditolak, hanya admin yang dapat menghapus | |
| 24 | Dashboard | Membuat satu transaksi selesai | Jumlah transaksi dan penjualan bertambah sesuai nilai | |
| 25 | Laporan stok | Membuka laporan stok | Jumlah stok sesuai data barang dan status stok benar | |
| 26 | Ganti password valid | Password lama benar dan password baru minimal 8 karakter | Password berhasil diubah | |
| 27 | Ganti password salah | Password lama tidak sesuai | Perubahan ditolak | |
| 28 | Akun nonaktif | Menonaktifkan akun kasir | Akun tidak dapat digunakan untuk login | |
| 29 | Hak akses manajemen akun | Kasir membuka manajemen akun admin | Akses ditolak | |

## Rekapitulasi

| No | Modul | Jumlah Kasus | Berhasil | Gagal |
|---|---|---|---|---|
| 1 | Autentikasi dan Hak Akses | 5 | | |
| 2 | Pengelolaan Kategori | 3 | | |
| 3 | Pengelolaan Barang | 4 | | |
| 4 | Konsistensi Stok | 3 | | |
| 5 | POS dan Pembayaran | 5 | | |
| 6 | Pengelolaan Transaksi | 3 | | |
| 7 | Dashboard dan Laporan | 2 | | |
| 8 | Pengaturan Akun | 4 | | |
| | **Total** | **29** | | |

**Persentase keberhasilan = (Jumlah kasus berhasil / Total kasus) × 100%**
