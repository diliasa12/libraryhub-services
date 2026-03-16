import express from "express";
import {
  getAllReview,
  createReview,
  updateReviewById,
  deleteReviewById,
} from "../controllers/reviewController.js";
const reviewRouter = express.Router();
reviewRouter.get("/", getAllReview);
reviewRouter.post("/", createReview);
reviewRouter.put("/:id", updateReviewById);
reviewRouter.delete("/:id", deleteReviewById);
export default reviewRouter;
