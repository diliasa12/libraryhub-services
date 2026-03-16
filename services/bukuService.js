import Buku from "../models/Buku.js";
import Peminjaman from "../models/Peminjaman.js";
export async function getAll() {
  const data = await Buku.find();
  return data;
}

export async function getById(id) {
  const data = await Buku.findById(id);
  return data;
}

export async function getByGenre(genre) {
  const data = await Buku.find({ genre });
  return data;
}
export async function getBySearch(filter) {
  const data = await Buku.find(filter);
  return data;
}
export async function getReviewFromBookId(id) {
  const data = await Peminjaman.find({ id_buku: id }).populate("id_buku");
  return data;
}

export async function add(data) {
  const result = await Buku.create(data);
  return result;
}
export async function updateById(id, content) {
  console.log(typeof content);
  await Buku.findOneAndUpdate({ _id: id }, content);
  const newRecord = await Buku.findById(id);
  return newRecord;
}
export async function deleteById(id) {
  const buku = await Buku.findById(id);
  if (buku.tersedia === false) {
    return null;
  }
  const newRecord = await Buku.updateOne(
    { _id: id },
    { $set: { isDelete: true } },
  );
  return newRecord;
}
