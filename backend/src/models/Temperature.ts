import { InferSchemaType, Schema, model } from "mongoose"; 

const temperatureSchema = new Schema({
    cid: { type: String, required: true },
    celsius:  { type: String, required: true },
    code: { type: String, required: true },
  }, { timestamps: true, timeseries: {
    timeField: "createdAt", //createdAt comes from timestamps
    metaField: "cid",
    granularity: "seconds"
 }},
);

type Temperature = InferSchemaType<typeof temperatureSchema>; // type for the model

/**
 * Temperature model with fields cid, celsius and code
 */
export default model<Temperature>("Temperature", temperatureSchema)

