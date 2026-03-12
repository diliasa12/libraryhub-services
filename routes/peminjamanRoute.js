import express from "express";
import {} from "../controllers/peminjamaController.js";
const peminjamanRouter = express.Router();
peminjamanRouter.get("/", getPeminjaman);
peminjamanRouter.get("/:id", getPeminjamanById);
peminjamanRouter.post("/", createPeminjaman);
peminjamanRouter.put("/:id/kembali", returnPeminjaman);
peminjamanRouter.put("/cek-terlambat", cekPeminjamanTerlambat);
export default peminjamanRouter;
