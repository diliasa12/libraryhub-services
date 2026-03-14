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
    status: "terlambat",
  });
  console.log(data);
  if (data.length === 0) {
    return null;
  }
  return data;
}

export async function add(content) {
  const buku = await Buku.findById(content.id_buku);
  const anggota = await Anggota.findById(content.id_anggota);
  console.log(anggota.status);
  if (anggota.status === "nonaktif") {
    return null;
  }
  const temp = buku.stok;
  if (temp <= 0) return null;

  await Buku.updateOne({ _id: buku._id }, { $set: { stok: temp - 1 } });
  const data = await Peminjaman.create(content);
  return data;
}
export async function kembali(id, tanggalKembaliAktual) {
  const peminjaman = await getById(id);
  if (
    !peminjaman ||
    peminjaman.status === "dikembalikan" ||
    peminjaman.status === "terlambat"
  )
    return null;

  const tanggalAktual = new Date(tanggalKembaliAktual);

  await Peminjaman.updateOne(
    { _id: peminjaman._id },
    { $set: { tgl_kembali_aktual: tanggalAktual } },
  );

  const peminjamanUpdate = await getById(id);
  const hariTerlambat = Math.floor(
    (peminjamanUpdate.tgl_kembali_rencana -
      peminjamanUpdate.tgl_kembali_aktual) /
      (1000 * 60 * 60 * 24),
  );

  const denda = hariTerlambat * 2000;
  console.log(hariTerlambat);
  console.log(denda);
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

  await Anggota.findByIdAndUpdate(
    { _id: peminjaman.id_anggota },
    {
      $set: { poin: poin + 1 },
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
