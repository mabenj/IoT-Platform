import axios from "axios";
import { DeviceData } from "../../../interfaces/device-data.interface";

async function getDeviceData(deviceId: string, start?: number, stop?: number) {
    const response = await axios.get<DeviceData[]>(
        `/api/deviceData/${deviceId}?start=${start}&stop=${stop}`
    );
    return response.data.map((deviceDatum) => ({
        ...deviceDatum,
        createdAt: new Date(deviceDatum.createdAt)
    }));
}

async function deleteAllDeviceData(deviceId: string) {
    //TODO
    throw new Error("Not implemented");
}

const DeviceDataService = { getDeviceData, deleteAllDeviceData };

export default DeviceDataService;
