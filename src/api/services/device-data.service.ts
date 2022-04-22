import moment from "moment";
import { nanoid } from "nanoid";
import { DeviceData } from "../../interfaces/device-data.interface";
import { generateRandomDeviceData } from "../../utils/utils";
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

let deviceData: DeviceData[] = [];
generateDemoData();

async function generateDemoData() {
	deviceData = generateRandomDeviceData(
		100,
		(await DeviceService.getAllDevices())
			.map(({ id }) => id || "")
			.filter((id) => !!id)
	);
}
