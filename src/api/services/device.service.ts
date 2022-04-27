import { Device as IDevice } from "../../interfaces/device.interface";
import Device from "../models/device.model";

const ACCESS_TOKEN_PATTERN = new RegExp("^([a-zA-Z0-9]{9,})$");

async function getAllDevices(): Promise<IDevice[]> {
	const result = await Device.find().exec();
	return Promise.resolve(result ? result : []);
}

async function getDevice(deviceId: string): Promise<IDevice> {
	const device = await Device.findById(deviceId).exec();
	if (!device) {
		return Promise.reject(new Error("Not found"));
	}
	return Promise.resolve(device);
}

async function addDevice(device: IDevice): Promise<IDevice> {
	if (!ACCESS_TOKEN_PATTERN.test(device.accessToken)) {
		return Promise.reject(new Error("Invalid access token"));
	}
	const newDevice = await new Device(device).save();
	return Promise.resolve(newDevice);
}

async function modifyDevice(
	deviceId: string,
	modifiedDevice: IDevice
): Promise<IDevice> {
	const newDevice = await Device.findByIdAndUpdate(
		deviceId,
		{
			$set: { ...modifiedDevice }
		},
		{ new: true }
	).exec();
	if (!newDevice) {
		return Promise.reject(new Error("Not found"));
	}
	return Promise.resolve(newDevice);
}

async function removeDevice(deviceId: string) {
	await Device.findByIdAndRemove(deviceId).exec();
}

async function getDeviceId(
	accessToken: string,
	protocol: string,
	enabled: boolean
): Promise<string> {
	const device = await Device.findOne(
		{ accessToken: accessToken, protocol: protocol, enabled: enabled },
		"id"
	).exec();
	if (!device) {
		return Promise.resolve("");
	}
	return Promise.resolve(device.id);
}

export default {
	getAllDevices,
	getDevice,
	addDevice,
	removeDevice,
	modifyDevice,
	getDeviceId
};
