import Peminjaman from "../models/Peminjaman.js";
import Review from "../models/Review.js";

export async function getAll() {
  const data = await Review.find().populate("id_anggota").populate("id_buku");
  if (data.length === 0) return null;
  return data;
}

export async function add(content) {
  const peminjaman = await Peminjaman.find({ id_anggota: content.id_anggota });
  if (peminjaman.length === 0 || peminjaman.isDelete === true) return null;
  const review = await Review.create(content);
  return review;
}
export async function updateReview(id, content) {
  const review = await Review.findById(id);
  console.log(review);
  if (review.length === 0 || review.isDelete === true) return null;
  await Review.updateOne(review, content);
  const data = await Review.findById(id);
  return data;
}
export async function deleteReview(id) {
  const review = await Review.findById(id);
  if (review.length === 0) return null;
  await Review.findByIdAndUpdate({ _id: id }, { isDelete: true });
  const data = await Review.findById(id);
  console.log(data);
  return data;
}
