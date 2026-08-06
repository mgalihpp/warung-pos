# Class Diagram Aplikasi Warung Mama Nia POS

Dokumen ini berisi rancangan class diagram untuk kebutuhan Bab 3. Class diagram disusun secara sederhana berdasarkan entity utama pada aplikasi, atribut penting, dan relasi antar entitas.

## Diagram Class

```mermaid
classDiagram
  class User {
    +String id
    +String name
    +String email
    +String role
    +DateTime createdAt
    +DateTime updatedAt
    +login()
    +logout()
    +updateProfile()
  }

  class Category {
    +String id
    +String name
    +String slug
    +String description
    +createCategory()
    +updateCategory()
    +deleteCategory()
  }

  class Product {
    +String id
    +String name
    +String unit
    +Int stock
    +Int minStock
    +Float buyPrice
    +Float sellPrice
    +Boolean isActive
    +createProduct()
    +updateProduct()
    +deleteProduct()
    +adjustStock()
    +checkLowStock()
  }

  class Transaction {
    +String id
    +String transactionNumber
    +String cashierName
    +PaymentMethod paymentMethod
    +TransactionStatus status
    +Float total
    +Float amountPaid
    +Float change
    +DateTime createdAt
    +createTransaction()
    +calculateTotal()
    +calculateChange()
    +updateStatus()
  }

  class TransactionItem {
    +String id
    +String productName
    +Float unitPrice
    +Int quantity
    +Float subtotal
    +Float grossProfit
    +calculateSubtotal()
    +calculateGrossProfit()
  }

  class StockAdjustment {
    +String id
    +String type
    +Int quantity
    +Int stockBefore
    +Int stockAfter
    +String reason
    +DateTime createdAt
    +recordAdjustment()
    +calculateStockAfter()
  }

  class PaymentMethod {
    <<enumeration>>
    CASH
    QRIS_MANUAL
    MANUAL_TRANSFER
  }

  class TransactionStatus {
    <<enumeration>>
    COMPLETED
    PENDING
    CANCELLED
  }

  User "1" --> "0..*" Transaction : membuat
  User "1" --> "0..*" StockAdjustment : melakukan
  Category "1" --> "0..*" Product : memiliki
  Product "1" --> "0..*" TransactionItem : dijual sebagai
  Product "1" --> "0..*" StockAdjustment : memiliki riwayat
  Transaction "1" --> "1..*" TransactionItem : terdiri dari
  Transaction --> PaymentMethod : menggunakan
  Transaction --> TransactionStatus : memiliki
```

## 1. Daftar Class Utama

Class utama pada aplikasi terdiri dari enam entity utama, yaitu `User`, `Category`, `Product`, `Transaction`, `TransactionItem`, dan `StockAdjustment`. Diagram dibuat sederhana agar fokus pada struktur data dan relasi utama yang dibutuhkan dalam penulisan ilmiah.

| No | Nama Class | Jenis Class | Deskripsi |
|----|------------|-------------|-----------|
| 1 | User | Entity | Menyimpan data pengguna aplikasi, baik admin maupun kasir. |
| 2 | Category | Entity | Menyimpan data kategori barang. |
| 3 | Product | Entity | Menyimpan data barang, stok, harga beli, dan harga jual. |
| 4 | Transaction | Entity | Menyimpan data transaksi penjualan. |
| 5 | TransactionItem | Entity | Menyimpan detail barang pada setiap transaksi. |
| 6 | StockAdjustment | Entity | Menyimpan riwayat perubahan stok barang. |

---

## 2. Class User

Class `User` digunakan untuk menyimpan data pengguna aplikasi. Pengguna memiliki role yang membedakan akses antara admin dan kasir.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key pengguna. |
| name | String | Nama pengguna. |
| email | String | Email pengguna dan bersifat unik. |
| emailVerified | Boolean | Status verifikasi email. |
| image | String? | Foto profil pengguna. |
| role | String? | Role pengguna, yaitu admin atau cashier. |
| banned | Boolean? | Status banned pengguna. |
| banReason | String? | Alasan pengguna dibanned. |
| banExpires | DateTime? | Batas waktu banned pengguna. |
| createdAt | DateTime | Waktu data pengguna dibuat. |
| updatedAt | DateTime | Waktu data pengguna terakhir diperbarui. |

| Method/Operasi | Keterangan |
|---------------|------------|
| login() | Digunakan untuk masuk ke aplikasi. |
| logout() | Digunakan untuk keluar dari aplikasi. |
| updateProfile() | Digunakan untuk memperbarui data profil pengguna. |
| changePassword() | Digunakan untuk mengubah password pengguna. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| User 1..* Transaction | Satu user/kasir dapat membuat banyak transaksi. |
| User 1..* StockAdjustment | Satu user/admin dapat melakukan banyak penyesuaian stok. |

---

## 3. Class Category

Class `Category` digunakan untuk mengelompokkan barang berdasarkan jenisnya, misalnya sembako, minuman, makanan ringan, dan kebutuhan rumah tangga.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key kategori. |
| name | String | Nama kategori dan bersifat unik. |
| slug | String | Format URL dari nama kategori dan bersifat unik. |
| description | String? | Deskripsi kategori. |
| createdAt | DateTime | Waktu kategori dibuat. |
| updatedAt | DateTime | Waktu kategori terakhir diperbarui. |

| Method/Operasi | Keterangan |
|---------------|------------|
| createCategory() | Menambahkan kategori baru. |
| updateCategory() | Mengubah data kategori. |
| deleteCategory() | Menghapus kategori. |
| getProducts() | Mengambil daftar produk berdasarkan kategori. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| Category 1..* Product | Satu kategori dapat memiliki banyak produk. |

---

## 4. Class Product

Class `Product` digunakan untuk menyimpan informasi barang yang dijual pada aplikasi POS.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key produk. |
| name | String | Nama produk. |
| categoryId | String | Foreign key ke class Category. |
| image | String? | URL gambar produk. |
| unit | String | Satuan produk, seperti pcs, bungkus, botol, atau kg. |
| stock | Int | Jumlah stok saat ini. |
| minStock | Int | Batas minimal stok. |
| buyPrice | Float | Harga beli/modal produk. |
| sellPrice | Float | Harga jual produk. |
| description | String? | Deskripsi produk. |
| isActive | Boolean | Status aktif produk. |
| createdAt | DateTime | Waktu produk dibuat. |
| updatedAt | DateTime | Waktu produk terakhir diperbarui. |

| Method/Operasi | Keterangan |
|---------------|------------|
| createProduct() | Menambahkan produk baru. |
| updateProduct() | Mengubah data produk. |
| deleteProduct() | Menghapus atau menonaktifkan produk. |
| adjustStock() | Menyesuaikan stok produk. |
| toggleActive() | Mengubah status aktif produk. |
| checkLowStock() | Mengecek apakah stok berada di bawah batas minimum. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| Product *..1 Category | Banyak produk dapat berada pada satu kategori. |
| Product 1..* TransactionItem | Satu produk dapat muncul pada banyak detail transaksi. |
| Product 1..* StockAdjustment | Satu produk dapat memiliki banyak riwayat perubahan stok. |

---

## 5. Class Transaction

Class `Transaction` digunakan untuk menyimpan data transaksi penjualan yang dilakukan oleh kasir.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key transaksi. |
| transactionNumber | String | Nomor transaksi unik. |
| cashierId | String | Foreign key ke class User. |
| cashierName | String | Nama kasir yang melakukan transaksi. |
| paymentMethod | PaymentMethod | Metode pembayaran: CASH, QRIS_MANUAL, atau MANUAL_TRANSFER. |
| status | TransactionStatus | Status transaksi: COMPLETED, PENDING, atau CANCELLED. |
| subtotal | Float | Total awal sebelum perhitungan akhir. |
| total | Float | Total akhir transaksi. |
| amountPaid | Float | Jumlah uang yang dibayarkan pelanggan. |
| change | Float | Jumlah kembalian. |
| notes | String? | Catatan transaksi. |
| createdAt | DateTime | Waktu transaksi dibuat. |

| Method/Operasi | Keterangan |
|---------------|------------|
| createTransaction() | Membuat transaksi baru. |
| calculateTotal() | Menghitung total transaksi. |
| calculateChange() | Menghitung kembalian. |
| updateStatus() | Mengubah status transaksi. |
| cancelTransaction() | Membatalkan transaksi. |
| getTransactionDetail() | Menampilkan detail transaksi. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| Transaction *..1 User | Banyak transaksi dapat dibuat oleh satu user/kasir. |
| Transaction 1..* TransactionItem | Satu transaksi memiliki banyak item transaksi. |

---

## 6. Class TransactionItem

Class `TransactionItem` digunakan untuk menyimpan detail barang yang dibeli dalam satu transaksi.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key detail transaksi. |
| transactionId | String | Foreign key ke class Transaction. |
| productId | String | Foreign key ke class Product. |
| productName | String | Nama produk saat transaksi terjadi. |
| unitPrice | Float | Harga jual produk saat transaksi terjadi. |
| costPrice | Float | Harga modal produk saat transaksi terjadi. |
| quantity | Int | Jumlah produk yang dibeli. |
| subtotal | Float | Subtotal item transaksi. |
| grossProfit | Float | Keuntungan kotor dari item transaksi. |
| createdAt | DateTime | Waktu detail transaksi dibuat. |

| Method/Operasi | Keterangan |
|---------------|------------|
| calculateSubtotal() | Menghitung subtotal item berdasarkan harga dan jumlah. |
| calculateGrossProfit() | Menghitung keuntungan kotor dari item transaksi. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| TransactionItem *..1 Transaction | Banyak item transaksi dimiliki oleh satu transaksi. |
| TransactionItem *..1 Product | Banyak item transaksi dapat mengacu pada satu produk. |

---

## 7. Class StockAdjustment

Class `StockAdjustment` digunakan untuk mencatat setiap perubahan stok barang, baik karena transaksi penjualan, penambahan stok, pengurangan stok, maupun koreksi stok.

| Atribut | Tipe Data | Keterangan |
|---------|-----------|------------|
| id | String | Primary key penyesuaian stok. |
| productId | String | Foreign key ke class Product. |
| userId | String | Foreign key ke class User. |
| type | String | Jenis perubahan stok: IN, OUT, atau CORRECTION. |
| quantity | Int | Jumlah perubahan stok. |
| stockBefore | Int | Stok sebelum perubahan. |
| stockAfter | Int | Stok setelah perubahan. |
| reason | String? | Alasan perubahan stok. |
| referenceId | String? | Referensi, misalnya ID transaksi. |
| createdAt | DateTime | Waktu perubahan stok dicatat. |

| Method/Operasi | Keterangan |
|---------------|------------|
| recordAdjustment() | Mencatat perubahan stok. |
| getStockHistory() | Menampilkan riwayat perubahan stok. |
| calculateStockAfter() | Menghitung stok setelah perubahan. |

**Relasi:**

| Relasi | Keterangan |
|--------|------------|
| StockAdjustment *..1 Product | Banyak penyesuaian stok dapat terjadi pada satu produk. |
| StockAdjustment *..1 User | Banyak penyesuaian stok dapat dilakukan oleh satu user. |

---

## 8. Relasi Antar Class

Relasi antar class utama pada aplikasi adalah sebagai berikut.

| No | Class A | Multiplicity | Class B | Keterangan |
|----|---------|--------------|---------|------------|
| 1 | User | 1..* | Transaction | Satu user/kasir dapat membuat banyak transaksi. |
| 2 | User | 1..* | StockAdjustment | Satu user dapat melakukan banyak penyesuaian stok. |
| 3 | Category | 1..* | Product | Satu kategori dapat memiliki banyak produk. |
| 4 | Product | 1..* | TransactionItem | Satu produk dapat muncul pada banyak item transaksi. |
| 5 | Product | 1..* | StockAdjustment | Satu produk dapat memiliki banyak riwayat perubahan stok. |
| 6 | Transaction | 1..* | TransactionItem | Satu transaksi memiliki banyak item transaksi. |

Representasi relasi sederhana:

```text
User              1 -------- * Transaction
User              1 -------- * StockAdjustment
Category          1 -------- * Product
Product           1 -------- * TransactionItem
Product           1 -------- * StockAdjustment
Transaction       1 -------- * TransactionItem
```

---

## 9. Enum yang Digunakan

### 9.1 PaymentMethod

Enum `PaymentMethod` digunakan untuk menentukan metode pembayaran transaksi.

| Nilai | Keterangan |
|-------|------------|
| CASH | Pembayaran tunai. |
| QRIS_MANUAL | Pembayaran menggunakan QRIS manual. |
| MANUAL_TRANSFER | Pembayaran menggunakan transfer manual. |

### 9.2 TransactionStatus

Enum `TransactionStatus` digunakan untuk menentukan status transaksi.

| Nilai | Keterangan |
|-------|------------|
| COMPLETED | Transaksi selesai. |
| PENDING | Transaksi masih menunggu proses. |
| CANCELLED | Transaksi dibatalkan. |

---

## 10. Deskripsi Class Diagram

Class diagram aplikasi Warung Mama Nia POS menggambarkan struktur data dan hubungan antar objek utama dalam sistem. Class `User` merepresentasikan pengguna aplikasi yang terdiri dari admin dan kasir. Admin memiliki akses untuk mengelola barang, kategori, transaksi, laporan, stok, dan akun pengguna, sedangkan kasir memiliki akses utama untuk melakukan transaksi melalui halaman POS.

Class `Category` digunakan untuk mengelompokkan data barang. Setiap `Product` wajib memiliki satu `Category`, sedangkan satu `Category` dapat memiliki banyak `Product`. Class `Product` menyimpan informasi barang seperti nama, satuan, stok, batas minimal stok, harga beli, harga jual, gambar, dan status aktif.

Proses transaksi direpresentasikan oleh class `Transaction` dan `TransactionItem`. Satu `Transaction` dibuat oleh satu `User` sebagai kasir, dan satu transaksi dapat memiliki banyak `TransactionItem`. Setiap `TransactionItem` mengacu pada satu `Product` serta menyimpan data harga dan nama produk pada saat transaksi terjadi agar riwayat transaksi tetap konsisten walaupun data produk berubah di kemudian hari.

Perubahan stok dicatat menggunakan class `StockAdjustment`. Class ini berfungsi sebagai riwayat perubahan stok, baik dari penjualan, penambahan stok, pengurangan stok, maupun koreksi stok. Dengan adanya class ini, sistem dapat melacak perubahan stok berdasarkan produk dan pengguna yang melakukan perubahan.
