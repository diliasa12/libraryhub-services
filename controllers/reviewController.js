import express from "express";
import { customErr } from "../utils/customErr.js";
import {
  add,
  getAll,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllReview = catchAsync(async (req, res) => {
  const data = await getAll();
  if (!data) {
    const err = customErr("review tidak ditemukan", 404);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});

export const createReview = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await add(data);
  if (!result) {
    const err = customErr("Anggota belum pernah pinjam buku", 400);
    throw err;
  }
  return res.status(201).json({ success: true, result });
});
export const updateReviewById = catchAsync(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const result = await updateReview(id, data);
  if (!result) {
    const err = customErr("review tidak ditemukan", 404);
    throw err;
  }
  return res.status(201).json({ success: true, result });
});

export const deleteReviewById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteReview(id);
  if (!result) {
    const err = customErr("Anggota belum pernah pinjam buku", 400);
    throw err;
  }
  return res.status(200).json({ success: true, result });
});
