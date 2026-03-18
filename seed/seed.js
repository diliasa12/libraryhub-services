import mongoose from "mongoose";
import Buku from "../models/Buku.js";
import Anggota from "../models/Anggota.js";
import Peminjaman from "../models/Peminjaman.js";

const bukuData = [
  {
    isbn: "978-0132350884",
    judul: "Clean Code",
    pengarang: "Robert C. Martin",
    penerbit: "Prentice Hall",
    tahun: 2008,
    genre: "Teknologi",
    stok: 5,
    tags: ["programming", "software engineering"],
    tersedia: true,
  },
  {
    isbn: "978-0201633610",
    judul: "Design Patterns",
    pengarang: "Gang of Four",
    penerbit: "Addison-Wesley",
    tahun: 1994,
    genre: "Teknologi",
    stok: 3,
    tags: ["programming", "design patterns"],
    tersedia: true,
  },
  {
    isbn: "978-0743273565",
    judul: "The Great Gatsby",
    pengarang: "F. Scott Fitzgerald",
    penerbit: "Scribner",
    tahun: 1925,
    genre: "Fiksi",
    stok: 4,
    tags: ["novel", "klasik"],
    tersedia: true,
  },
  {
    isbn: "978-0061120084",
    judul: "To Kill a Mockingbird",
    pengarang: "Harper Lee",
    penerbit: "HarperCollins",
    tahun: 1960,
    genre: "Fiksi",
    stok: 6,
    tags: ["novel", "klasik"],
    tersedia: true,
  },
  {
    isbn: "978-0375700455",
    judul: "Sapiens",
    pengarang: "Yuval Noah Harari",
    penerbit: "Harper",
    tahun: 2011,
    genre: "Sejarah",
    stok: 4,
    tags: ["sejarah", "manusia"],
    tersedia: true,
  },
  {
    isbn: "978-0525559474",
    judul: "A Brief History of Time",
    pengarang: "Stephen Hawking",
    penerbit: "Bantam Books",
    tahun: 1988,
    genre: "Sains",
    stok: 2,
    tags: ["fisika", "alam semesta"],
    tersedia: true,
  },
  {
    isbn: "978-0316769174",
    judul: "The Catcher in the Rye",
    pengarang: "J.D. Salinger",
    penerbit: "Little, Brown",
    tahun: 1951,
    genre: "Fiksi",
    stok: 0,
    tags: ["novel", "klasik"],
    tersedia: false,
  },
  {
    isbn: "978-0140449136",
    judul: "Atomic Habits",
    pengarang: "James Clear",
    penerbit: "Avery",
    tahun: 2018,
    genre: "NonFiksi",
    stok: 7,
    tags: ["self-help", "produktivitas"],
    tersedia: true,
  },
];

const anggotaData = [
  {
    _id: new mongoose.Types.ObjectId("650000000000000000000001"),
    no_anggota: "AGT-001",
    nama: "Budi Santoso",
    email: "budi@gmail.com",
    telp: "081234567890",
    status: "aktif",
    poin: 10,
  },
  {
    _id: new mongoose.Types.ObjectId("650000000000000000000002"),
    no_anggota: "AGT-002",
    nama: "Siti Rahayu",
    email: "siti@gmail.com",
    telp: "082345678901",
    status: "aktif",
    poin: 5,
  },
  {
    _id: new mongoose.Types.ObjectId("650000000000000000000003"),
    no_anggota: "AGT-003",
    nama: "Ahmad Fauzi",
    email: "ahmad@gmail.com",
    telp: "083456789012",
    status: "aktif",
    poin: 8,
  },
  {
    _id: new mongoose.Types.ObjectId("650000000000000000000004"),
    no_anggota: "AGT-004",
    nama: "Dewi Lestari",
    email: "dewi@gmail.com",
    telp: "084567890123",
    status: "nonaktif",
    poin: 2,
  },
  {
    _id: new mongoose.Types.ObjectId("650000000000000000000005"),
    no_anggota: "AGT-005",
    nama: "Rizky Pratama",
    email: "rizky@gmail.com",
    telp: "085678901234",
    status: "aktif",
    poin: 15,
  },
];

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/perpus");
    console.log("✅ Connected to MongoDB");

    // Hapus data lama
    await Promise.all([
      Buku.deleteMany({}),
      Anggota.deleteMany({}),
      Peminjaman.deleteMany({}),
    ]);
    console.log("🗑️  Data lama dihapus");

    // Insert data baru
    const buku = await Buku.insertMany(bukuData);
    const anggota = await Anggota.insertMany(anggotaData);
    console.log(`📚 ${buku.length} buku berhasil ditambahkan`);
    console.log(`👤 ${anggota.length} anggota berhasil ditambahkan`);

    // Buat data peminjaman dummy
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const peminjamanData = [
      {
        id_buku: buku[0]._id, // Clean Code
        id_anggota: anggota[0]._id, // Budi
        tgl_pinjam: today,
        tgl_kembali_rencana: nextWeek,
        status: "dipinjam",
      },
      {
        id_buku: buku[1]._id, // Design Patterns
        id_anggota: anggota[1]._id, // Siti
        tgl_pinjam: today,
        tgl_kembali_rencana: nextWeek,
        status: "dipinjam",
      },
      {
        id_buku: buku[2]._id, // The Great Gatsby
        id_anggota: anggota[2]._id, // Ahmad
        tgl_pinjam: new Date("2024-01-01"),
        tgl_kembali_rencana: new Date("2024-01-08"),
        tgl_kembali_aktual: new Date("2024-01-08"),
        status: "dikembalikan",
        denda: 0,
      },
      {
        id_buku: buku[0]._id, // Clean Code (dipinjam lagi)
        id_anggota: anggota[2]._id, // Ahmad
        tgl_pinjam: new Date("2024-02-01"),
        tgl_kembali_rencana: new Date("2024-02-08"),
        tgl_kembali_aktual: new Date("2024-02-15"),
        status: "terlambat",
        denda: 14000,
      },
      {
        id_buku: buku[4]._id, // Sapiens
        id_anggota: anggota[4]._id, // Rizky
        tgl_pinjam: new Date("2024-03-01"),
        tgl_kembali_rencana: new Date("2024-03-08"),
        tgl_kembali_aktual: new Date("2024-03-08"),
        status: "dikembalikan",
        denda: 0,
      },
    ];

    const peminjaman = await Peminjaman.insertMany(peminjamanData);
    console.log(`📋 ${peminjaman.length} peminjaman berhasil ditambahkan`);

    console.log("🌱 Seeding selesai!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding gagal:", err.message);
    process.exit(1);
  }
}

seed();
