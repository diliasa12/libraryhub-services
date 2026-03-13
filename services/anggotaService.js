import Anggota from "../models/Anggota.js";
import Peminjaman from "../models/Peminjaman.js";

export async function getAnggota() {
  return await Anggota.find();
}

export async function getById(id) {
  const data = await Anggota.findById(id);
  return data;
}
export async function getRiwayat(id) {
  const data = await Peminjaman.find({ id_anggota: id }).populate("id_anggota");
  if (data.length === 0) {
    return null;
  }
  return data;
}
export async function add(content) {
  const data = await Anggota.create(content);
  return data;
}

export async function updateById(id, content) {
  const anggota = await Anggota.findById(id);
  if (!anggota) {
    return null;
  }
  await Anggota.updateOne({ _id: id }, content);
  const newRecord = Anggota.findById(id);
  return newRecord;
}
export async function deleteById(id) {
  const anggota = await Anggota.findById(id);
  if (!anggota) {
    return null;
  }
  await Anggota.updateOne({ _id: id }, { $set: { status: "nonaktif" } });
  const newrecord = Anggota.findById(id);
  return newrecord;
}
