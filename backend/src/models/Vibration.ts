import { InferSchemaType, Schema, model } from "mongoose"; 

const vibrationSchema = new Schema({
    cid: { type: String, required: true },
    celsius:  { type: String, required: true },
    vRms: { type: String, required: true },
    aPeak: { type: String, required: true },
    aRms: { type: String, required: true },
    crest: { type: String, required: true },
    code: { type: String, required: true },
  }, { timestamps: true, timeseries: { // timeseries
    timeField: "createdAt", //createdAt comes from timestamps
    metaField: "cid",
    granularity: "seconds"
 }},
);

type Vibrations = InferSchemaType<typeof vibrationSchema>; // type for the model

/**
 * Vibration model with fields cid, celsius, vRms, aPeak, aRMs, crest and code
 */
export default model<Vibrations>("Vibration", vibrationSchema)

