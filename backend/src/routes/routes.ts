import express from "express";
import * as TemperatureData from "../controllers/temperaturecontroller";
import * as HumidityData from "../controllers/humiditycontroller";
import * as vibrationData from "../controllers/Vibrationcontroller";

const router = express.Router(); //create a router object

router.get("/temps", TemperatureData.getTemperatures);
router.get("/humidity", HumidityData.getHumidity);
router.get("/vibration", vibrationData.getVibration);

export default router;

