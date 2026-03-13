import Anggota from "../models/Anggota.js";
import Buku from "../models/Buku.js";
import Peminjaman from "../models/Peminjaman.js";
export async function getAll() {
  const data = await Peminjaman.find();
  if (data.length === 0) {
    return null;
  }
  return data;
}
export async function getById(id) {
  const data = await Peminjaman.findById(id);
  if (data.length === 0) {
    return null;
  }
  return data;
}
export async function getTerlambat() {
  const data = await Peminjaman.find({
    $eq: peminjaman_actual > peminjaman_rencana,
  });
  if (data.length === 0) {
    return null;
  }
  return data;
}

export async function add(content) {
  const buku = await getById(content.id_buku);
  if (!(buku?.stok >= 0)) return null;
  buku.stok -= 1;
  const data = await content.updateOne(content, {
    $set: { tgl_kembali_rencana: Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });
  return data;
}
export async function kembali(id) {
  const peminjaman = await getById(id);

  if (!peminjaman) return null;
  const hariTerlambat = Math.floor(
    (peminjaman.tgl_kembali_aktual - peminjaman.tgl_kembali_rencana) /
      (1000 * 60 * 60 * 24),
  );
  const denda = hariTerlambat * 2000;
  await Peminjaman.updateOne(peminjaman, {
    $set: {
      denda: denda,
      status: "dikembalikan",
    },
  });
  await Anggota.findByIdAndUpdate(
    { _id: peminjaman.id_anggota },
    {
      $set: { poin: poin + 10 },
    },
  );
  await Buku.findByIdAndUpdate(
    { _id: peminjaman.id_buku },
    { $set: { stok: stok + 1 } },
  );
  const data = await getById(id);
  return data;
}

export async function cekTerlambat() {
  const peminjaman = await Peminjaman.updateMany(
    {
      tgl_kembali_rencana: { $gt: tngl_kembali_aktual },
    },
    { status: "terlambat" },
  );
  if (peminjaman.modifiedCount === 0) {
    return null;
  }
  const data = await Peminjaman.find({ status: "terlambat" });
  return data;
}
