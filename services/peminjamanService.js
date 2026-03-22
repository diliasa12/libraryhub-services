import mongoose from "mongoose";
import Anggota from "../models/Anggota.js";
import Buku from "../models/Buku.js";
import Peminjaman from "../models/Peminjaman.js";
export async function getAll(page, limit) {
  const skip = (page - 1) * limit;
  const data = await Peminjaman.find()
    .skip(skip)
    .limit(limit)
    .populate("id_buku")
    .populate("id_anggota");
  if (data.length === 0) {
    return null;
  }
  return data;
}
export async function getById(id) {
  const data = await Peminjaman.findById(id)
    .populate("id_buku")
    .populate("id_anggota");
  if (!data) {
    return null;
  }
  return data;
}
export async function getTerlambat(page, limit) {
  const skip = (page - 1) * limit;
  const data = await Peminjaman.find({
    status: "terlambat",
  })
    .skip(skip)
    .limit(limit);

  if (data.length === 0) {
    return null;
  }
  return data;
}

export async function add(content) {
  const buku = await Buku.findById(content.id_buku);
  if (!buku) return null;
  const anggota = await Anggota.findById(content.id_anggota);
  let stokBuku = buku.stok;

  if (
    anggota.status === "nonaktif" ||
    buku.isDelete === true ||
    buku.tersedia == false
  ) {
    return null;
  }

  await Buku.updateOne({ _id: buku._id }, { $set: { stok: stokBuku - 1 } });

  const newBuku = await Buku.findById(content.id_buku);

  if (newBuku.stok === 0) {
    await Buku.updateOne({ _id: buku._id }, { $set: { tersedia: false } });
  }

  const data = await Peminjaman.create(content);
  return data;
}

export async function kembali(id, tanggalKembaliAktual) {
  const peminjaman = await Peminjaman.findById(id);
  console.log(peminjaman);
  if (
    !peminjaman ||
    peminjaman.status === "dikembalikan" ||
    peminjaman.status === "terlambat"
  )
    return null;

  const anggota = await Anggota.findById(peminjaman.id_anggota);
  const buku = await Buku.findById(peminjaman.id_buku);

  const tanggalAktual = new Date(tanggalKembaliAktual);

  await Peminjaman.updateOne(
    { _id: peminjaman._id },
    { $set: { tgl_kembali_aktual: tanggalAktual } },
  );

  const peminjamanUpdate = await Peminjaman.findById(id);
  const hariTerlambat = Math.floor(
    (peminjamanUpdate.tgl_kembali_aktual -
      peminjamanUpdate.tgl_kembali_rencana) /
      (1000 * 60 * 60 * 24),
  );

  const denda = hariTerlambat * 2000;

  if (hariTerlambat > 0) {
    await Peminjaman.updateOne(peminjamanUpdate, {
      $set: {
        denda: denda,
        status: "terlambat",
      },
    });
  } else {
    await Peminjaman.updateOne(peminjamanUpdate, {
      $set: {
        denda: denda,
        status: "dikembalikan",
      },
    });
  }

  let incPoin = anggota.poin + 1;
  let incStok = buku.stok;
  await Anggota.findByIdAndUpdate(
    { _id: peminjaman.id_anggota },
    {
      $set: { poin: incPoin + 1 },
    },
  );
  await Buku.findByIdAndUpdate(
    { _id: peminjaman.id_buku },
    { $set: { stok: incStok + 1 } },
  );

  const newBuku = await Buku.findById(peminjaman.id_buku);
  console.log(newBuku);
  if (newBuku.tersedia === false) {
    console.log("masuk");
    await Buku.findByIdAndUpdate(newBuku._id, { $set: { tersedia: true } });
  }
  const data = await Buku.findById(newBuku._id);
  return data;
}

export async function cekTerlambat() {
  const peminjaman = await Peminjaman.updateMany(
    {
      $expr: { $gt: ["$tgl_kembali_aktual", "$tgl_kembali_rencana"] },
    },
    { $set: { status: "terlambat" } },
  );
  if (peminjaman.modifiedCount === 0) {
    return null;
  }
  const data = await Peminjaman.find({ status: "terlambat" });
  return data;
}

export async function getRekomendasi(id_anggota) {
  console.log("masuk");
  const genreFavorit = await Peminjaman.aggregate([
    {
      $match: {
        id_anggota: new mongoose.Types.ObjectId(id_anggota),
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "id_buku",
        foreignField: "_id",
        as: "buku",
      },
    },
    {
      $unwind: "$buku",
    },
    {
      $group: {
        _id: "$buku.genre",
        total: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
    { $limit: 1 },
  ]);
  if (genreFavorit.length === 0) return null;
  const genre = genreFavorit[0]._id;
  console.log(genre);
  const bukuDipinjam = await Peminjaman.find({
    id_anggota: new mongoose.Types.ObjectId(id_anggota),
  }).distinct("id_buku");
  const rekomendasi = await Buku.aggregate([
    {
      $match: {
        genre: genre,
        isDelete: false,
        tersedia: true,
        _id: { $nin: bukuDipinjam },
      },
    },
    {
      $lookup: {
        from: "borrows",
        localField: "_id",
        foreignField: "id_buku",
        as: "riwayat",
      },
    },
    {
      $addFields: {
        totalDipinjam: {
          $size: { $ifNull: ["$riwayat", []] },
        },
      },
    },
    {
      $sort: {
        totalDipinjam: -1,
      },
    },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        isbn: 1,
        judul: 1,
        pengarang: 1,
        penerbit: 1,
        genre: 1,
        stok: 1,
        totalDipinjam: 1,
      },
    },
  ]);
  if (rekomendasi.length === 0) return null;
  return {
    genreFavorit: genre,
    rekomendasi,
  };
}
