export interface Device {
	name: string;
	accessToken: string;
	enabled: boolean;
	protocol: "http" | "coap";
	id?: string;
	created?: Date;
	lastModified?: Date;
	description?: string;
}
