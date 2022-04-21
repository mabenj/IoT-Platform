export interface Device {
	id: string;
	name: string;
	accessToken: string;
	enabled: boolean;
	protocol: "http" | "coap";
	created: Date;
	lastModified: Date;
	description?: string;
}
