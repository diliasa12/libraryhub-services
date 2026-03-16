import mongoose from "mongoose";
const AnggotaSchema = new mongoose.Schema(
  {
    no_anggota: { type: String, required: true, unique: true },
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    no_hp: { type: String },
    alamat: { type: String },
    status: { type: String, enum: ["aktif", "nonaktif"], default: "aktif" },
    poin: { type: Number, default: 0 }, // poin reward
  },
  { timestamps: true },
);
const Anggota = mongoose.model("members", AnggotaSchema);
export default Anggota;
