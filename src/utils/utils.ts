import { faker } from "@faker-js/faker";
import moment from "moment";
import { nanoid } from "nanoid";
import { DeviceData } from "../interfaces/device-data.interface";
import { Device } from "../interfaces/device.interface";

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateDemoDevices(count: number): Device[] {
	const devices: Device[] = [];
	for (let i = 0; i < count; i++) {
		const modifiedOn = faker.date.recent(100);
		const createdOn = faker.date.recent(365, modifiedOn);
		devices.push({
			name: faker.hacker.noun(),
			description: Math.random() > 0.3 ? faker.hacker.phrase() : undefined,
			accessToken: nanoid(6),
			enabled: Math.random() > 0.3,
			id: nanoid(),
			protocol: Math.random() > 0.5 ? "http" : "coap",
			created: createdOn,
			lastModified: modifiedOn
		});
	}
	return devices;
}

export function generateRandomDeviceData(
	count: number,
	deviceIds: string[]
): DeviceData[] {
	const data: DeviceData[] = [];
	for (let i = 0; i < count; i++) {
		data.push({
			guid: nanoid(),
			timestamp: moment().subtract(i, "days").toDate(),
			deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
			data: JSON.parse(faker.datatype.json())
		});
	}
	return data;
}
