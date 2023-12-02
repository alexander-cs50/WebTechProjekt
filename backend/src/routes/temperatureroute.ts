import express from "express";
import * as TemperatureData from "../controllers/temperaturecontroller";

const router = express.Router();

router.post("/", TemperatureData.createTemperatures)

router.get("/", TemperatureData.getTemperatures)

export default router;