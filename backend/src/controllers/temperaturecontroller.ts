import { RequestHandler } from "express";
import TemperatureModel from "../models/Temperature";
import createHttpError from "http-errors";


interface CreateTemperatureDataBody {
  recordedtemperature?: string;
  sensor?: string;
}
export const createTemperatures: RequestHandler<
  unknown,
  unknown,
  CreateTemperatureDataBody,
  unknown
> = async (req, res, next) => {
  const recordedtemperature = req.body.recordedtemperature; 
  const sensor = req.body.sensor; 
  try {

    if (!recordedtemperature || !sensor )
    {
        throw createHttpError(400, "sensor or recordedtemperature missing")
    }
    const newTemperatureData = await TemperatureModel.create({
      //In here we now say we want to create a new entry in the db with the consts we created above
      recordedtemperature: recordedtemperature,
      sensor: sensor,
    });

    res.status(201).json(newTemperatureData); // saying new resource has been created
  } catch (error) {
    next(error);
  }
};

export const getTemperatures: RequestHandler = async (req, res, next) => {
  try {
    const temperaturedata = await TemperatureModel.find().exec(); //With this we get the data from the database
    res.status(200).json(temperaturedata); // this catches the response from the await above as ok and then gives out the sensordata as json
  } catch (error) {
    //Error Handling Part 2
    next(error); // give the error over to the next route.
  }
};
