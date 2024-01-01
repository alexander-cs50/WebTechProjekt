import { InferSchemaType, Schema, model } from "mongoose"; 

const humiditySchema = new Schema({
    cid: { type: String, required: true },
    humidity:  { type: String, required: true },
    celsius:  { type: String, required: true },
    code: { type: String, required: true },
  }, { timestamps: true, timeseries: {
    timeField: "createdAt",
    metaField: "cid",
    granularity: "seconds"
 }},
);

type Humidity = InferSchemaType<typeof humiditySchema>;

/**
* MongoDB Model with the fields cid, data, code, is a timeseries
*/
export default model<Humidity>("Humidity", humiditySchema)

