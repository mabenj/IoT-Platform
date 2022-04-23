export interface Device {
	id: string;
	name: string;
	accessToken: string;
	enabled: boolean;
	protocol: "http" | "coap";
	description: string;
	createdAt: Date;
	updatedAt: Date;
}
