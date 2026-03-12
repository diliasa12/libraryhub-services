import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getBookReview,
  updateBook,
} from "../controllers/bukuController.js";

const bukuRoute = express.Router();

bukuRoute.get("/", getAllBooks);
bukuRoute.get("/:id", getBookById);
bukuRoute.get("/:id/review", getBookReview);
bukuRoute.put("/:id", updateBook);
bukuRoute.post("/", createBook);
bukuRoute.delete("/:id", deleteBook);
export default bukuRoute;
