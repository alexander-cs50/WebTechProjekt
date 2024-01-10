import { RequestHandler } from "express";
import TemperatureModel from "../models/Temperature";

export const getTemperatures: RequestHandler = async (req, res, next) => { //This is the function that gets the data from the database
  try {
    const temperaturedata = await TemperatureModel.find().exec(); //Saves the data from the database in the variable sensordata
    res.status(200).json(temperaturedata); // this catches the response from the await above as ok and then gives out the sensordata as json
  } catch (error) {
    //Error Handling
    next(error); // give the error over to the next route.
  }
};


