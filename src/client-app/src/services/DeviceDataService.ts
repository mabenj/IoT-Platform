import axios from "axios";
import { DeviceData } from "../../../interfaces/device-data.interface";

async function getAllDeviceData(deviceId: string) {
    const response = await axios.get<DeviceData[]>("/api/deviceData");
    return response.data.map((deviceDatum) => ({
        ...deviceDatum,
        createdAt: new Date(deviceDatum.createdAt)
    }));
}

async function deleteAllDeviceData(deviceId: string) {
    //TODO
    throw new Error("Not implemented");
}

const DeviceDataService = { getAllDeviceData, deleteAllDeviceData };

export default DeviceDataService;
