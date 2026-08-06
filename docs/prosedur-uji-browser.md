# Prosedur Uji Browser — Warung Mama Nia POS

Ikuti langkah secara berurutan. Catat hasil di kolom Kesimpulan: **Berhasil** jika hasil aktual sesuai hasil yang diharapkan, **Gagal** jika berbeda. Ambil tangkapan layar sebagai bukti.

**Persiapan:**
1. Jalankan `npm run dev`, buka http://localhost:3000.
2. Siapkan akun: admin (contoh: `admin@example.com`) dan kasir.
3. Pastikan ada barang dengan stok 0, stok 5, dan stok normal.

---

## 1. Login Admin
1. Buka http://localhost:3000 → diarahkan ke halaman login.
2. Isi email dan password admin yang benar.
3. Klik tombol Masuk.
4. **Hasil:** login berhasil, masuk ke dashboard admin.

## 2. Login Kasir
1. Logout dari akun admin.
2. Isi email dan password kasir yang benar.
3. Klik tombol Masuk.
4. **Hasil:** login berhasil, masuk ke dashboard kasir.

## 3. Login Gagal (password salah)
1. Di halaman login, isi email yang benar.
2. Isi password yang salah.
3. Klik tombol Masuk.
4. **Hasil:** login ditolak, pesan kesalahan tampil, tidak masuk ke dashboard.

## 4. Hak Akses (kasir buka halaman admin)
1. Login sebagai kasir.
2. Ketik alamat `/admin` di browser.
3. **Hasil:** akses ditolak atau diarahkan ke halaman unauthorized.

## 5. Logout
1. Login sebagai admin atau kasir.
2. Klik menu/tombol Logout.
3. Buka kembali halaman `/admin` atau `/cashier`.
4. **Hasil:** sesi berakhir, diminta login kembali.

## 6. Tambah Kategori
1. Login sebagai admin, buka menu Kategori.
2. Klik tombol Tambah.
3. Isi nama (misal: "Minuman") dan deskripsi.
4. Klik Simpan.
5. **Hasil:** kategori tersimpan dan tampil pada daftar.

## 7. Validasi Kategori (nama kosong)
1. Di halaman Kategori, klik Tambah.
2. Biarkan nama kosong, isi deskripsi saja.
3. Klik Simpan.
4. **Hasil:** data ditolak, pesan "Nama kategori wajib diisi" tampil.

## 8. Duplikat Kategori
1. Buat kategori "Minuman" (atau nama yang sudah ada).
2. Buat lagi kategori dengan nama yang sama.
3. Klik Simpan.
4. **Hasil:** duplikasi ditolak, kategori lama tetap ada di daftar.

## 9. Tambah Barang
1. Login sebagai admin, buka menu Barang.
2. Klik Tambah.
3. Isi nama, pilih kategori, isi satuan, harga beli, harga jual, stok.
4. Klik Simpan.
5. **Hasil:** barang tersimpan dan tampil pada daftar.

## 10. Validasi Stok (negatif/desimal)
1. Di form tambah barang, isi stok `-1`.
2. Coba simpan → **Hasil:** ditolak, stok tidak boleh negatif.
3. Isi stok `1,5`.
4. Coba simpan → **Hasil:** ditolak, stok harus bilangan bulat.

## 11. Validasi Harga (jual lebih kecil dari beli)
1. Di form tambah barang, isi harga beli `10000`.
2. Isi harga jual `9000`.
3. Klik Simpan.
4. **Hasil:** ditolak, pesan "Harga jual tidak boleh lebih kecil dari harga beli".

## 12. Status Barang (nonaktif)
1. Di daftar barang, pilih barang aktif.
2. Ubah status menjadi nonaktif.
3. Buka halaman POS kasir.
4. **Hasil:** barang tidak muncul di katalog POS.

## 13. Konsistensi Stok Setelah Transaksi
1. Catat stok barang (misal: 10).
2. Login kasir, buka POS.
3. Tambahkan barang tersebut sebanyak 2, selesaikan pembayaran.
4. Cek stok barang → **Hasil:** stok berkurang tepat 2 (menjadi 8).

## 14. Batal Transaksi (stok kembali)
1. Login admin, buka menu Transaksi.
2. Pilih transaksi selesai, ubah status menjadi Dibatalkan.
3. Cek stok barang → **Hasil:** stok dikembalikan sesuai jumlah transaksi.

## 15. Hapus Transaksi (stok kembali)
1. Login admin, buka menu Transaksi.
2. Hapus transaksi berstatus selesai.
3. Cek stok barang → **Hasil:** stok dikembalikan dan transaksi terhapus.

## 16. Keranjang Stok 0
1. Siapkan barang dengan stok 0.
2. Login kasir, buka POS.
3. Cari barang stok 0 tersebut.
4. **Hasil:** barang tidak dapat ditambahkan ke keranjang.

## 17. Batas Kuantitas (maks = stok)
1. Siapkan barang dengan stok 5.
2. Di POS, tambahkan barang tersebut.
3. Tekan tombol tambah terus sampai lebih dari 5.
4. **Hasil:** kuantitas maksimum tetap 5.

## 18. Pembayaran Tunai Pas
1. Tambahkan barang sehingga total Rp20.000.
2. Pilih metode Tunai, isi uang bayar Rp20.000.
3. Klik Bayar.
4. **Hasil:** transaksi berhasil, kembalian Rp0.

## 19. Pembayaran Kurang
1. Tambahkan barang sehingga total Rp20.000.
2. Pilih metode Tunai, isi uang bayar Rp15.000.
3. Klik Bayar.
4. **Hasil:** transaksi ditolak, tampil keterangan kurang Rp5.000.

## 20. Keranjang Kosong
1. Di POS, biarkan keranjang kosong.
2. Coba klik Bayar.
3. **Hasil:** transaksi tidak dapat diproses, tombol Bayar nonaktif / pesan keranjang kosong.

## 21. Edit Transaksi Melebihi Stok
1. Login admin, buka detail transaksi.
2. Edit kuantitas item menjadi lebih besar dari stok yang tersedia.
3. Coba simpan.
4. **Hasil:** perubahan ditolak, stok tidak menjadi negatif.

## 22. Detail Transaksi
1. Login admin, buka menu Transaksi.
2. Klik transaksi yang valid.
3. Periksa isi detail.
4. **Hasil:** item, metode bayar, total, dan catatan tampil benar.

## 23. Hak Akses Kasir (hapus transaksi)
1. Login sebagai kasir.
2. Buka menu Transaksi.
3. Coba hapus sebuah transaksi.
4. **Hasil:** penghapusan ditolak, hanya admin yang dapat menghapus.

## 24. Dashboard
1. Catat jumlah transaksi dan nilai penjualan di dashboard admin.
2. Buat satu transaksi selesai melalui POS.
3. Buka kembali dashboard admin.
4. **Hasil:** jumlah transaksi bertambah 1 dan penjualan bertambah sesuai nilai.

## 25. Laporan Stok
1. Login admin, buka menu Laporan → Laporan Stok.
2. Bandingkan jumlah stok di laporan dengan data barang.
3. **Hasil:** jumlah stok sesuai dan status stok (normal/menipis/habis) benar.

## 26. Ganti Password Valid
1. Login admin, buka menu Pengaturan Akun.
2. Isi password lama yang benar.
3. Isi password baru minimal 8 karakter, ulangi di konfirmasi.
4. Klik Simpan.
5. **Hasil:** password berhasil diubah.

## 27. Ganti Password Salah (lama salah)
1. Di Pengaturan Akun, isi password lama yang salah.
2. Isi password baru dan konfirmasi yang benar.
3. Klik Simpan.
4. **Hasil:** perubahan ditolak.

## 28. Akun Nonaktif
1. Login admin, buka Manajemen Akun.
2. Pilih akun kasir, ubah status menjadi nonaktif.
3. Logout, coba login dengan akun kasir tersebut.
4. **Hasil:** akun tidak dapat digunakan untuk login.

## 29. Hak Akses Manajemen Akun
1. Login sebagai kasir.
2. Ketik alamat halaman manajemen akun admin di browser.
3. **Hasil:** akses ditolak.
