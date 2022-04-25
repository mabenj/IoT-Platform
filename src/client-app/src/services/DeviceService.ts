import axios from "axios";
import { Device } from "../../../interfaces/device.interface";

async function getAllDevices() {
	const response = await axios.get("/api/devices");
	return response.data;
}

async function registerDevice(device: Device) {
	const response = await axios.post("/api/devices", device);
	return response.data;
}

async function deleteDevice(deviceId: string) {
	//TODO
	throw new Error("Not implemented");
}

async function modifyDevice(device: Device) {
	//TODO
	throw new Error("Not implemented");
}

const DeviceService = {
	getAllDevices,
	registerDevice,
	deleteDevice,
	modifyDevice
};

export default DeviceService;
