import { Device as IDevice } from "../../interfaces/device.interface";
import Device from "../../models/device.model";

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

async function getDeviceId(accessToken: string): Promise<string> {
	const device = await Device.findOne(
		{ accessToken: accessToken },
		"id"
	).exec();
	if (!device) {
		return Promise.reject(new Error("Not found"));
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
