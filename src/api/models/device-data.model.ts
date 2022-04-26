import mongoose, { Schema } from "mongoose";
import { DeviceData } from "../../interfaces/device-data.interface";

const DeviceDataSchema: Schema = new Schema(
	{
		data: { type: {}, required: true },
		deviceId: { type: mongoose.Types.ObjectId, required: true }
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
				delete ret.updatedAt;
			}
		}
	}
);

export default mongoose.model<DeviceData>("DeviceData", DeviceDataSchema);
