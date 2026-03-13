import express from "express";
import {
  getPeminjaman,
  getPeminjamanById,
  createPeminjaman,
  returnPeminjaman,
  cekPeminjamanTerlambat,
} from "../controllers/peminjamanController.js";
const peminjamanRouter = express.Router();
peminjamanRouter.get("/", getPeminjaman);
peminjamanRouter.get("/:id", getPeminjamanById);
peminjamanRouter.post("/", createPeminjaman);
peminjamanRouter.put("/:id/kembali", returnPeminjaman);
peminjamanRouter.put("/cek-terlambat", cekPeminjamanTerlambat);
export default peminjamanRouter;
