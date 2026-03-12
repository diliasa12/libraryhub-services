import mongoose from "mongoose";
const PeminjamanSchema = new mongoose.Schema(
  {
    id_buku: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buku",
      required: true,
    },
    id_anggota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anggota",
      required: true,
    },
    tgl_pinjam: { type: Date, default: Date.now },
    tgl_kembali_rencana: { type: Date, required: true }, // +7 hari dari tgl_pinjam
    tgl_kembali_aktual: { type: Date },
    status: {
      type: String,
      enum: ["dipinjam", "dikembalikan", "terlambat"],
      default: "dipinjam",
    },
    denda: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const Peminjaman = new mongoose.model("borrows", PeminjamanSchema);
export default Peminjaman;
