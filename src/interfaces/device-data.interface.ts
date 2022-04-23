import { Document } from "mongoose";

export interface DeviceData extends Document {
	id: string;
	data: { [key: string]: any };
	deviceId: string;
	createdAt: Date;
}
