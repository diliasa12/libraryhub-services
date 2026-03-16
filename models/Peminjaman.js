import mongoose from "mongoose";
const PeminjamanSchema = new mongoose.Schema(
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
    tgl_pinjam: { type: Date, default: Date.now },
    tgl_kembali_rencana: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const tgl_pinjam = new Date(this.tgl_pinjam);
          const expected = new Date(tgl_pinjam);
          expected.setDate(tgl_pinjam.getDate() + 7);

          // bandingkan hanya tanggalnya (tanpa jam)
          return value.toDateString() === expected.toDateString();
        },
        message: "Tanggal kembali harus 7 hari setelah tanggal pinjam",
      },
    },
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
const Peminjaman = mongoose.model("borrows", PeminjamanSchema);
export default Peminjaman;
