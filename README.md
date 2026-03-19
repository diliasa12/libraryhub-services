# 📚 Perpustakaan REST API

REST API untuk sistem manajemen perpustakaan berbasis Node.js, Express, dan MongoDB.

---

## 🛠️ Teknologi

- Node.js
- Express.js
- MongoDB & Mongoose

---

## ⚙️ Instalasi

```bash
# Clone repository
git clone <repo-url>
cd <nama-folder>

# Install dependencies
npm install
```

---

## 🌱 Menjalankan Seed (Data Dummy)

Seed digunakan untuk mengisi database dengan data awal secara otomatis.

> ⚠️ **Peringatan:** Seed akan **menghapus semua data lama** sebelum mengisi data baru. Jangan jalankan di production.

```bash
# Jalankan seed
npm run seed
```

Output yang muncul jika berhasil:

```
Connected to MongoDB
Data lama dihapus
8 buku berhasil ditambahkan
5 anggota berhasil ditambahkan
5 peminjaman berhasil ditambahkan
3 review berhasil ditambahkan
Seeding selesai!
```

Data yang di-seed:

- **8 Buku** — berbagai genre (Teknologi, Fiksi, Sejarah, Sains, NonFiksi)
- **5 Anggota** — 4 aktif, 1 nonaktif (AGT-001 s/d AGT-005)
- **5 Peminjaman** — kombinasi status dipinjam, dikembalikan, dan terlambat
- **3 Review** — dari anggota yang sudah pernah meminjam buku

---

## 🚀 Menjalankan Server

```bash
# Development (dengan nodemon)
npm run dev

# Production
npm start
```

Server berjalan di: `http://localhost:4000`

---

## 📖 Dokumentasi Endpoint

### 📚 Buku

| Method | Path                    | Deskripsi                                                     |
| ------ | ----------------------- | ------------------------------------------------------------- |
| GET    | `/buku`                 | Ambil semua buku (support pagination)                         |
| GET    | `/buku/:id`             | Ambil buku berdasarkan ID                                     |
| GET    | `/buku?genre=:genre`    | Filter buku berdasarkan genre                                 |
| GET    | `/buku?search=:keyword` | Cari buku berdasarkan judul atau pengarang (regex)            |
| GET    | `/buku/:id/review`      | Ambil semua review untuk buku tertentu (populate anggota)     |
| GET    | `/buku/rekomendasi`     | Rekomendasi buku berdasarkan genre favorit anggota            |
| POST   | `/buku`                 | Tambah buku baru                                              |
| PUT    | `/buku/:id`             | Update data buku                                              |
| DELETE | `/buku/:id`             | Hapus buku (validasi: tidak boleh hapus jika sedang dipinjam) |

#### Query Params — GET `/buku`

```
GET /buku?page=1&limit=10
GET /buku?genre=Teknologi
GET /buku?search=clean
GET /buku?genre=Fiksi&search=gatsby&page=1&limit=5
```

| Param    | Default | Deskripsi                                     |
| -------- | ------- | --------------------------------------------- |
| `page`   | `1`     | Halaman ke-                                   |
| `limit`  | `10`    | Jumlah data per halaman                       |
| `genre`  | -       | Filter berdasarkan genre                      |
| `search` | -       | Cari berdasarkan judul atau pengarang (regex) |

#### Query Params — GET `/buku/rekomendasi`

```
GET /buku/rekomendasi?id_anggota=650000000000000000000001
```

| Param        | Wajib | Deskripsi                                  |
| ------------ | ----- | ------------------------------------------ |
| `id_anggota` | ✅    | ID anggota yang ingin mendapat rekomendasi |

#### Contoh Request Body — POST/PUT `/buku`

```json
{
  "isbn": "978-0132350884",
  "judul": "Clean Code",
  "pengarang": "Robert C. Martin",
  "penerbit": "Prentice Hall",
  "tahun": 2008,
  "genre": "Teknologi",
  "stok": 5,
  "tags": ["programming", "software engineering"],
  "tersedia": true
}
```

---

### 👤 Anggota

| Method | Path                   | Deskripsi                                                  |
| ------ | ---------------------- | ---------------------------------------------------------- |
| GET    | `/anggota`             | Ambil semua anggota                                        |
| GET    | `/anggota/:id`         | Ambil anggota berdasarkan ID                               |
| GET    | `/anggota/:id/riwayat` | Ambil riwayat peminjaman anggota (populate buku)           |
| POST   | `/anggota`             | Daftarkan anggota baru                                     |
| PUT    | `/anggota/:id`         | Update data anggota                                        |
| DELETE | `/anggota/:id`         | Nonaktifkan anggota (soft delete: ubah status ke nonaktif) |

#### Contoh Request Body — POST/PUT `/anggota`

```json
{
  "no_anggota": "AGT-006",
  "nama": "John Doe",
  "email": "john@gmail.com",
  "telp": "081234567890",
  "status": "aktif"
}
```

---

### 📋 Peminjaman

| Method | Path                       | Deskripsi                                                                           |
| ------ | -------------------------- | ----------------------------------------------------------------------------------- |
| GET    | `/pinjam`                  | Ambil semua data peminjaman (populate buku & anggota)                               |
| GET    | `/pinjam/:id`              | Ambil detail peminjaman                                                             |
| GET    | `/pinjam?status=terlambat` | Filter peminjaman berdasarkan status                                                |
| POST   | `/pinjam`                  | Buat peminjaman baru (validasi stok, kurangi stok, set tgl_kembali_rencana +7 hari) |
| PUT    | `/pinjam/:id/kembali`      | Proses pengembalian: hitung denda (Rp2.000/hari), tambah poin anggota, tambah stok  |
| PUT    | `/pinjam/cek-terlambat`    | Update status semua peminjaman yang melewati tgl_kembali_rencana menjadi terlambat  |

#### Query Params — GET `/pinjam`

```
GET /pinjam?status=terlambat
GET /pinjam?status=dipinjam
GET /pinjam?status=dikembalikan
```

#### Contoh Request Body — POST `/pinjam`

```json
{
  "id_buku": "64f1a2b3c4d5e6f7a8b9c0d1",
  "id_anggota": "650000000000000000000001"
}
```

#### Contoh Request Body — PUT `/pinjam/:id/kembali`

```json
{
  "tanggalKembaliAktual": "2024-03-19"
}
```

---

### ⭐ Review

| Method | Path          | Deskripsi                                          |
| ------ | ------------- | -------------------------------------------------- |
| GET    | `/review`     | Ambil semua review (populate buku & anggota)       |
| POST   | `/review`     | Tambah review (anggota harus pernah meminjam buku) |
| PUT    | `/review/:id` | Update review                                      |
| DELETE | `/review/:id` | Hapus review                                       |

#### Contoh Request Body — POST `/review`

```json
{
  "id_buku": "64f1a2b3c4d5e6f7a8b9c0d1",
  "id_anggota": "650000000000000000000001",
  "rating": 5,
  "komentar": "Buku yang sangat bagus dan informatif!"
}
```

> ⚠️ **Validasi:** Anggota hanya bisa mereview buku yang sudah pernah dipinjam dan dikembalikan. Satu anggota hanya bisa memberi satu review per buku.

---

### 📊 Statistik

| Method | Path         | Deskripsi                            |
| ------ | ------------ | ------------------------------------ |
| GET    | `/statistik` | Ambil statistik lengkap perpustakaan |

#### Contoh Response — GET `/statistik`

```json
{
  "totalBuku": 120,
  "anggotaAktif": 45,
  "peminjamanBerjalan": 12,
  "totalDenda": 85000,
  "bukuTerpopuler": [
    {
      "judul": "Clean Code",
      "pengarang": "Robert C. Martin",
      "genre": "Teknologi",
      "isbn": "978-0132350884",
      "totalPinjam": 24
    }
  ]
}
```

---

## 📁 Struktur Folder

```
├── models/
│   ├── Buku.js
│   ├── Anggota.js
│   ├── Peminjaman.js
│   └── Review.js
├── routes/
│   ├── bukuRoute.js
│   ├── anggotaRoute.js
│   ├── peminjamanRoute.js
│   ├── reviewRoute.js
│   └── statistikRoute.js
├── controllers/
│   ├── bukuController.js
│   ├── anggotaController.js
│   ├── peminjamanController.js
│   ├── reviewController.js
│   └── statistikController.js
├── services/
│   ├── bukuService.js
│   ├── anggotaService.js
│   ├── peminjamanService.js
│   ├── reviewService.js
│   └── statistikService.js
├── middlewares/
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── logger.js
├── utils/
│   ├── catchAsync.js
│   └── customErr.js
├── seed.js
├── server.js
└── README.md
```

---

## 🔢 Genre yang Tersedia

`Fiksi` `NonFiksi` `Sains` `Sejarah` `Teknologi` `Lainnya`

## 📌 Status Peminjaman

| Status         | Keterangan                             |
| -------------- | -------------------------------------- |
| `dipinjam`     | Buku sedang dipinjam                   |
| `dikembalikan` | Buku sudah dikembalikan tepat waktu    |
| `terlambat`    | Buku dikembalikan melebihi batas waktu |

## 💰 Perhitungan Denda

Denda dihitung berdasarkan jumlah hari keterlambatan:

```
Denda = jumlah hari terlambat × Rp 2.000
```
