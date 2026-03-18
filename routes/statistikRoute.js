import express from "express";
import { getAllStatistik } from "../controllers/statistikController.js";
const statistikRouter = express.Router();
statistikRouter.get("/", getAllStatistik);
export default statistikRouter;
