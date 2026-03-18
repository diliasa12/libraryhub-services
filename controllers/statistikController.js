import { getStatistik } from "../services/statistikService.js";
import catchAsync from "../utils/catchAsync.js";
import { customErr } from "../utils/customErr.js";

export const getAllStatistik = catchAsync(async (req, res) => {
  const data = await getStatistik();
  if (!data) {
    const err = customErr("statistik tidak ditemukan", 404);
    throw err;
  }
  return res.status(200).json({ success: true, data });
});
