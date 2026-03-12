import express from "express";
import {
  createAnggota,
  updateAnggota,
  deleteAnggota,
  getAllAnggota,
  getAnggotaById,
  getRiwayatAnggota,
} from "../controllers/anggotaController.js";
const anggotaRoute = express.Router();
anggotaRoute.get("/", getAllAnggota);
anggotaRoute.get("/:id", getAnggotaById);
anggotaRoute.get("/:id/riwayat", getRiwayatAnggota);
anggotaRoute.post("/", createAnggota);
anggotaRoute.put("/:id", updateAnggota);
anggotaRoute.delete("/:id", deleteAnggota);
export default anggotaRoute;
