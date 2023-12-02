import { RequestHandler } from "express";
import TemperatureModel from "../models/Temperature";



interface CreateTemperatureDataBody {                                                                                                             // Creating an interface so we can check ourselves if the Body Data is actually a string, we will also use this to check if the sensorname is actually included 
    recordedtemperature?: string,
    sensor?: string,
}
export const createTemperatures: RequestHandler<unknown, unknown, CreateTemperatureDataBody, unknown> = async (req, res, next) => {                 //This Handler will be able to create new Data in our db, we pass the CreateSensorDataBody in the RequestHandler
    const recordedtemperature = req.body.recordedtemperature;                                                                                                  //telling it to use the sensorname we send to it via http.post
    const sensor = req.body.sensor;                                                                                                              //telling it to use the grad we send to it via http.post
    try {
        const newTemperatureData = await TemperatureModel.create({                                                                                 //In here we now say we want to create a new entry in the db with the consts we created above
            recordedtemperature: recordedtemperature,
            sensor: sensor
        });

        res.status(201).json(newTemperatureData)                                                                                                  // saying new resource has been created
    } catch (error) {
        next(error);
        
    }
};

export const getTemperatures: RequestHandler = async (req, res, next) => {                                                                    //changed this to asnyc so we can use await in the function.
    try {                                                                                                                                    //Error Handling!
        const temperaturedata = await TemperatureModel.find().exec()                                                                           //With this we get the data from the database
        res.status(200).json(temperaturedata);                                                                                                   // this catches the response from the await above as ok and then gives out the sensordata as json    
    } catch (error) {                                                                                                                        //Error Handling Part 2
        next(error);                                                                                                                         // give the error over to the next route.
    }
};