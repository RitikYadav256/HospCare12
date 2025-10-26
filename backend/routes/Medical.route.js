import express from "express";
import { getMedicineList } from "../controller/Medical.controller.js";

const router = express.Router();

// Route to fetch medicine list
router.post("/Medicine", getMedicineList);

export default router;
