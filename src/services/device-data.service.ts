import moment from "moment";
import { nanoid } from "nanoid";
import { DeviceData } from "../interfaces/device-data.interface";
import DeviceService from "./device.service";

async function getDeviceData(deviceId: string): Promise<DeviceData[]> {
	return Promise.resolve(
		deviceData.filter((deviceData) => deviceData.deviceId === deviceId)
	);
}

async function addDeviceData(
	accessToken: string,
	data: any
): Promise<DeviceData> {
	const newDeviceDatum: DeviceData = {
		guid: nanoid(),
		deviceId: await DeviceService.getDeviceId(accessToken),
		timestamp: moment().toDate(),
		data: data
	};
	deviceData.push(newDeviceDatum);
	return Promise.resolve(newDeviceDatum);
}

async function removeDeviceData(deviceId: string): Promise<boolean> {
	deviceData = deviceData.filter(
		(deviceDatum) => deviceDatum.deviceId !== deviceId
	);
	return Promise.resolve(true);
}

export default {
	getDeviceData,
	addDeviceData,
	removeDeviceData
};

let deviceData: DeviceData[] = [
	{
		deviceId: "1337",
		guid: nanoid(),
		timestamp: moment().subtract(10, "days").toDate(),
		data: {
			temperature: 40,
			isCelsius: true,
			humidity: 30
		}
	},
	{
		deviceId: "1337",
		guid: nanoid(),
		timestamp: moment().subtract(9, "days").toDate(),
		data: {
			temperature: 44,
			isCelsius: true,
			humidity: 33
		}
	},
	{
		deviceId: "1337",
		guid: nanoid(),
		timestamp: moment().subtract(8, "days").toDate(),
		data: {
			temperature: 39,
			isCelsius: true,
			humidity: 20
		}
	},
	{
		deviceId: "1337",
		guid: nanoid(),
		timestamp: moment().subtract(7, "days").toDate(),
		data: {
			temperature: 47,
			isCelsius: true,
			humidity: 41
		}
	},
	{
		deviceId: "1337",
		guid: nanoid(),
		timestamp: moment().subtract(6, "days").toDate(),
		data: {
			temperature: 54,
			isCelsius: true,
			humidity: 60
		}
	}
];
