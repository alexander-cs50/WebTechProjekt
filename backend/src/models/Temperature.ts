import { InferSchemaType, Schema, model } from "mongoose"; 

const temperatureSchema = new Schema({
    cid: { type: String, required: true },
    data:  { type: String, required: true },
    code: { type: String, required: true },
  }, { timestamps: true, timeseries: {
    timeField: "createdAt",
    metaField: "cid",
    granularity: "seconds"
 }},
);

type Temperature = InferSchemaType<typeof temperatureSchema>;

/**
* MongoDB Model with the fields recorded_temperature and sensor, is a timeseries
*/
export default model<Temperature>("Temperature", temperatureSchema)

