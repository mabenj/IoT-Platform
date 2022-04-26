import { DeviceData as IDeviceData } from "../../interfaces/device-data.interface";
import DeviceData from "../models/device-data.model";
import DeviceService from "./device.service";

async function getDeviceData(deviceId: string): Promise<IDeviceData[]> {
	const deviceData = await DeviceData.find({ deviceId: deviceId }).exec();
	return Promise.resolve(deviceData ? deviceData : []);
}

async function addDeviceData(
	accessToken: string,
	data: any
): Promise<IDeviceData> {
	const newDeviceDatum = await new DeviceData({
		deviceId: await DeviceService.getDeviceId(accessToken),
		data: data
	}).save();
	return Promise.resolve(newDeviceDatum);
}

async function removeDeviceData(deviceId: string) {
	await DeviceData.findOneAndRemove({ deviceId: deviceId }).exec();
}

export default {
	getDeviceData,
	addDeviceData,
	removeDeviceData
};
