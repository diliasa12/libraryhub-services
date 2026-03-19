import Buku from "../models/Buku.js";
import Review from "../models/Review.js";
export async function getAll(page, limit) {
  const skip = (page - 1) * limit;
  const data = await Buku.find().skip(skip).limit(limit);
  return data;
}

export async function getById(id) {
  const data = await Buku.findById(id);
  return data;
}

export async function getByGenre(genre, page, limit) {
  const skip = (page - 1) * limit;
  const data = await Buku.find({ genre }).skip(skip).limit(limit);
  return data;
}
export async function getBySearch(filter, page, limit) {
  const skip = (page - 1) * limit;
  const data = await Buku.find(filter).skip(skip).limit(limit);
  return data;
}
export async function getReviewFromBookId(id) {
  const data = await Review.find({ id_buku: id }).populate("id_anggota");

  if (data.length === 0) return null;

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
