import moment from "moment";
import { nanoid } from "nanoid";
import { Device } from "../interfaces/device.interface";

async function getAllDevices(): Promise<Device[]> {
	return Promise.resolve(devices);
}

async function getDevice(deviceId: string): Promise<Device> {
	const device = devices.find(({ id }) => id === deviceId);
	if (!device) {
		return Promise.reject(new Error("Not found"));
	}
	return Promise.resolve(device);
}

async function addDevice(device: Device): Promise<Device> {
	if (devices.some(({ accessToken }) => accessToken === device.accessToken)) {
		return Promise.reject(new Error("Access token is already in use"));
	}
	const newDevice = {
		...device,
		id: nanoid(),
		created: moment().toDate(),
		lastModified: moment().toDate()
	};
	devices.push(newDevice);
	return Promise.resolve(newDevice);
}

async function modifyDevice(modifiedDevice: Device): Promise<Device> {
	try {
		let existingDevice = await getDevice(modifiedDevice.id!);
		existingDevice = { ...modifiedDevice, lastModified: moment().toDate() };
		await removeDevice(existingDevice.id!);
		await addDevice(existingDevice);
		return Promise.resolve(existingDevice);
	} catch (err) {
		return Promise.reject(err);
	}
}

async function removeDevice(deviceId: string): Promise<boolean> {
	const deviceIndex = devices.findIndex(({ id }) => id === deviceId);
	if (deviceIndex === -1) {
		return Promise.resolve(false);
	}
	devices = devices.splice(deviceIndex, 1);
	return Promise.resolve(true);
}

async function getDeviceId(accessToken: string): Promise<string> {
	const device = devices.find((device) => device.accessToken === accessToken);
	return Promise.resolve(device?.accessToken || "");
}

export default {
	getAllDevices,
	getDevice,
	addDevice,
	removeDevice,
	modifyDevice,
	getDeviceId
};

let devices: Device[] = [
	{
		name: "Device A",
		description: "a device...",
		accessToken: "12345",
		enabled: false,
		id: "1337",
		protocol: "http",
		created: moment().subtract(1, "year").toDate(),
		lastModified: moment().subtract(200, "days").toDate()
	},
	{
		name: "Device B",
		accessToken: "99999",
		enabled: true,
		id: "4567",
		protocol: "coap",
		created: moment().subtract(1, "day").toDate(),
		lastModified: moment().subtract(1, "day").toDate()
	},
	{
		name: "Device C",
		description: "c device...",
		accessToken: "foobar123",
		enabled: true,
		id: "111111",
		protocol: "http",
		created: moment().subtract(12, "day").toDate(),
		lastModified: moment().subtract(5, "minute").toDate()
	}
];
