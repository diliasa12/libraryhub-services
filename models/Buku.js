import mongoose from "mongoose";

const BukuSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    judul: { type: String, required: true },
    pengarang: { type: String, required: true },
    penerbit: { type: String },
    tahun: { type: Number },
    genre: {
      type: String,
      enum: ["Fiksi", "NonFiksi", "Sains", "Sejarah", "Teknologi", "Lainnya"],
    },
    stok: { type: Number, required: true, min: 0 },
    tags: [{ type: String }],
    tersedia: { type: Boolean, default: true },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const Buku = new mongoose.model("books", BukuSchema);
export default Buku;
