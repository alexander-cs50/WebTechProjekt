import { RequestHandler } from "express";
import HumidityModel from "../models/Humidity";


export const getHumidity: RequestHandler = async (req, res, next) => {
  try {
    const humiditydata = await HumidityModel.find().exec(); //With this we get the data from the database
    res.status(200).json(humiditydata); // this catches the response from the await above as ok and then gives out the sensordata as json
  } catch (error) {
    //Error Handling Part 2
    next(error); // give the error over to the next route.
  }
};
