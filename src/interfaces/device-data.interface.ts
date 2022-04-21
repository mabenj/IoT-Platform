export interface DeviceData {
	guid: string;
	deviceId: string;
	timestamp: Date;
	data: { [key: string]: any };
}
