import {
  getAll,
  getById,
  getTerlambat,
  add,
  cekTerlambat,
  kembali,
  getRekomendasi,
} from "../services/peminjamanService.js";
import catchAsync from "../utils/catchAsync.js";
import { customErr } from "../utils/customErr.js";

export const getPeminjaman = catchAsync(async (req, res) => {
  const { status, page, limit } = req.query;
  if (!page || !limit) {
    const err = customErr("Page atau limit dibutuhkan", 400);
    throw err;
  }
  let data;
  if (status) {
    data = await getTerlambat(page, limit);
    if (!data) {
      const err = customErr("Tidak ada peminjaman yang terlambat", 404);
      throw err;
    }
  } else {
    data = await getAll(page, limit);
    if (!data) {
      const err = customErr("Tidak ada peminjaman", 404);
      throw err;
    }
  }
  return res.status(200).json(data);
});
export const getPeminjamanById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getById(id);
  if (!data) {
    const err = customErr("Tidak ada peminjaman", 404);
    throw err;
  }
  return res.status(200).json(data);
});

export const createPeminjaman = catchAsync(async (req, res) => {
  const content = req.body;

  const data = await add(content);
  if (!data) {
    const err = customErr("Gagal membuat peminjaman", 400);
    throw err;
  }
  return res.status(200).json(data);
});
export const returnPeminjaman = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { tgl_kembali_aktual: tanggalKembaliAktual } = req.body;
  console.log(tanggalKembaliAktual);
  const data = await kembali(id, tanggalKembaliAktual);
  if (!data) {
    const err = customErr("Gagal mengembalikan buku", 400);
    throw err;
  }
  return res.status(200).json(data);
});
export const cekPeminjamanTerlambat = catchAsync(async (req, res) => {
  const data = await cekTerlambat();
  if (!data) {
    const err = customErr("Tidak ada yang terlambat", 404);
    throw err;
  }
  return res.status(200).json(data);
});
export const getRekomendasiBuku = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    const err = customErr("dibutuhkan id anggota", 404);
    throw err;
  }

  const data = await getRekomendasi(id);
  if (!data) {
    const err = customErr("tidak ada rekomendasi", 404);
    throw err;
  }

  return res.status(200).json({ success: true, data });
});
