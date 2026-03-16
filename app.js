import express from "express";
import mongoose from "mongoose";
import bukuRoute from "./routes/bukuRoute.js";
import anggotaRoute from "./routes/anggotaRoute.js";
import pinjamRoute from "./routes/peminjamanRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import { logger } from "./middlewares/logger.js";
const app = express();
const PORT = 4000;
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1/perpus")
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err.message));
// app.use(rateLimiter);
app.use(logger);
app.use("/buku", bukuRoute);
app.use("/anggota", anggotaRoute);
app.use("/pinjam", pinjamRoute);
app.use("/review", reviewRouter);
app.use(errorHandler);
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
