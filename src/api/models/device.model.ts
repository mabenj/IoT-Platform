import mongoose, { Schema } from "mongoose";
import { Device } from "../../interfaces/device.interface";

const DeviceSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        accessToken: { type: String, required: true, unique: true },
        enabled: { type: Boolean, required: true },
        protocol: { type: String, required: true },
        description: { type: String },
        hasTimeSeries: { type: Boolean, required: true, default: false },
        timeSeriesConfigurations: [{ unit: String, valueField: String }]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret._id;
            }
        }
    }
);

export default mongoose.model<Device>("Device", DeviceSchema);
