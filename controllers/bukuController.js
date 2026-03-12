import catchAsync from "../utils/catchAsync.js";
import {
  add,
  deleteById,
  getAll,
  getByGenre,
  getById,
  getBySearch,
  getReviewFromBookId,
  updateById,
} from "../services/bukuService.js";
import { customErr } from "../utils/customErr.js";

export const getAllBooks = catchAsync(async (req, res) => {
  const { genre, search } = req.query;
  if (genre) {
    const dataGenre = await getByGenre(genre);
    if (dataGenre.length === 0) {
      const err = customErr("Book doesn't exist", 404);
      throw err;
    }
    return res.status(200).send({ success: true, dataGenre });
  }
  if (search) {
    let filter = {};
    const regex = new RegExp(search, "i");
    filter.judul = regex;
    const result = await getBySearch(filter);

    if (result.length === 0) {
      const err = customErr("Book doesn't exist", 404);
      throw err;
    }
    return res.status(200).send({ success: true, result });
  }

  const data = await getAll();

  if (data.length === 0) {
    const err = customErr("Empty list of books", 404);
    throw err;
  }
  return res.status(200).send({ success: true, data });
});
export const getBookById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getById(id);
  if (!data) {
    const err = customErr("Book doesn't exist", 404);
    throw err;
  }
  res.status(200).send({ success: true, data });
});
export const getBookReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = getReviewFromBookId(id);
  if (!data) {
    const err = customErr("Book doesn't has review yet", 404);
    throw err;
  }
  res.status(200).send({ success: true, data });
});
export const createBook = catchAsync(async (req, res) => {
  const data = req.body;
  if (!data) {
    const err = customErr("Request body missing", 400);
    throw err;
  }
  const result = await add(data);
  res.status(201).send({ success: true, result });
});

export const updateBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const content = req.body;
  if (!id) {
    const err = customErr("Book doesn't exist", 404);
    throw err;
  }
  console.log(content);
  const data = await updateById(id, content);
  res.status(201).send({ success: true, data });
});

export const deleteBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const err = customErr("required id", 400);
    throw err;
  }
  const deletedBook = await deleteById(id);
  if (!deletedBook) {
    const err = customErr("Buku sedang dipinjam", 400);
    throw err;
  }
  return res.status(204).send({ success: true, deletedBook });
});
