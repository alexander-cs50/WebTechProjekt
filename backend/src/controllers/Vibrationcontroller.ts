import { RequestHandler } from "express";
import Vibration from "../models/Vibration";

export const getVibration: RequestHandler = async (req, res, next) => { //This is the function that gets the data from the database
  try {
    const vibrationdata = await Vibration.find().exec(); //Saves the data from the database in the variable sensordata
    res.status(200).json(vibrationdata); // this catches the response from the await above as ok and then gives out the sensordata as json
  } catch (error) {
    //Error Handling
    next(error); // give the error over to the next route.
  }
};


