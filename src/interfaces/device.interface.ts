export interface Device {
	name: string;
	accessToken: string;
	enabled: boolean;
	protocol: "http" | "coap";
	description: string;
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
