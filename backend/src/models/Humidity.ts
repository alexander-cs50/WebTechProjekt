import { InferSchemaType, Schema, model } from "mongoose"; 

const humiditySchema = new Schema({
    cid: { type: String, required: true },
    humidity:  { type: String, required: true },
    celsius:  { type: String, required: true },
    code: { type: String, required: true },
  }, { timestamps: true, timeseries: {
    timeField: "createdAt", //createdAt comes from timestamps
    metaField: "cid",
    granularity: "seconds"
 }},
);

type Humidity = InferSchemaType<typeof humiditySchema>; // type for the model

/**
 * Humidity model with fields cid, humidity, celsius and code
 */
export default model<Humidity>("Humidity", humiditySchema)

