import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema(
  {
    id_buku: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    id_anggota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    komentar: { type: String },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const Review = mongoose.model("Reviews", ReviewSchema);
export default Review;
