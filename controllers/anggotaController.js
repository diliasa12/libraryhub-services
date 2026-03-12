import {
  getAnggota,
  getById,
  getRiwayat,
  add,
  updateById,
  deleteById,
} from "../services/anggotaService.js";
import catchAsync from "../utils/catchAsync.js";
import { customErr } from "../utils/customErr.js";

export const getAllAnggota = catchAsync(async (req, res) => {
  const data = await getAnggota();
  if (data.length === 0) {
    const err = customErr("Anggota tidak ditemukan", 404);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});
export const getAnggotaById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getById(id);
  if (!data) {
    const err = customErr("Anggota tidak ditemukan", 404);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});
export const getRiwayatAnggota = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getRiwayat(id);
  if (!data) {
    const err = customErr("Riwayat tidak ditemukan", 404);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});
export const createAnggota = catchAsync(async (req, res) => {
  const content = req.body;
  const data = await add(content);
  if (!data) {
    const err = customErr("Gagal membuat Anggota", 400);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});
export const updateAnggota = catchAsync(async (req, res) => {
  const { id } = req.params;
  const content = req.body;
  const data = await updateById(id, content);
  if (!data) {
    const err = customErr("Anggota tidak ditemukan", 404);
    throw err;
  }
  return res.status(201).send({ success: true, data });
});
export const deleteAnggota = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await deleteById(id);
  if (!data) {
    const err = customErr("Anggota tidak ditemukan", 404);
    throw err;
  }
  return res.status(204).json({ success: true, data });
});
