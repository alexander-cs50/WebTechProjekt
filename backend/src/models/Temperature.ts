import { InferSchemaType, Schema, model } from "mongoose"; 

const temperatureSchema = new Schema({
    recordedtemperature: { type: String, required: true },
    sensor: { type: String, required: true },

}, { timestamps: true },
);

type Temperature = InferSchemaType<typeof temperatureSchema>;

/**
* MongoDB Model with the fields recorded_temperature and sensor, is a timeseries
*/
export default model<Temperature>("Temperature", temperatureSchema)

