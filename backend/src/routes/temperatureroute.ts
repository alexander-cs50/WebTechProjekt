import express from "express";
import * as TemperatureData from "../controllers/temperaturecontroller";
import * as HumidityData from "../controllers/humiditycontroller";

const router = express.Router();

router.post("/temps", TemperatureData.createTemperatures)

router.get("/temps", TemperatureData.getTemperatures)
router.get("/humidity", HumidityData.getHumidity)

export default router;