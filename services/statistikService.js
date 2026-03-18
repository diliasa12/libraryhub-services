import Anggota from "../models/Anggota.js";
import Buku from "../models/Buku.js";
import Peminjaman from "../models/Peminjaman.js";

export async function getStatistik() {
  const [
    totalBuku,
    anggotaAktif,
    peminjamanBerjalan,
    dendaStats,
    bukuTerpopuler,
  ] = await Promise.all([
    Buku.countDocuments({ isDelete: false }),
    Anggota.countDocuments({ status: "aktif" }),
    Peminjaman.countDocuments({ status: "dipinjam" }),
    Peminjaman.aggregate([
      {
        $match: {
          denda: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalDenda: { $sum: "$denda" },
        },
      },
    ]),
    Peminjaman.aggregate([
      {
        $group: {
          _id: "$id_buku",
          totalPinjam: { $sum: 1 },
        },
      },
      { $sort: { totalPinjam: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "buku",
        },
      },
      { $unwind: "$buku" },
      {
        $match: {
          "buku.isDelete": false,
        },
      },
      {
        $project: {
          _id: 0,
          judul: "$buku.judul",
          pengarang: "$buku.pengarang",
          genre: "$buku.genre",
          isbn: "$buku.isbn",
          totalPinjam: 1,
        },
      },
    ]),
  ]);
  return {
    totalBuku,
    anggotaAktif,
    peminjamanBerjalan,
    totalDenda: dendaStats[0]?.totalDenda ?? 0,
    bukuTerpopuler,
  };
}
