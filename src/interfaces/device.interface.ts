import { Document } from "mongoose";

export interface Device extends Document {
	id: string;
	name: string;
	accessToken: string;
	enabled: boolean;
	protocol: "http" | "coap";
	description: string;
	createdAt: Date;
	updatedAt: Date;
}
