import { DeviceData as IDeviceData } from "../../interfaces/device-data.interface";
import DeviceData from "../models/device-data.model";

async function getAllDeviceData(deviceId: string): Promise<IDeviceData[]> {
    const deviceData = await DeviceData.find({ deviceId }).exec();
    return Promise.resolve(deviceData ? deviceData : []);
}

async function getMostRecentDeviceData(
    deviceId: string,
    start?: number,
    stop?: number
): Promise<IDeviceData[]> {
    if (start && stop) {
        const deviceData = await DeviceData.find({ deviceId })
            .sort({ createdAt: "asc" })
            .limit(stop)
            .skip(start)
            .exec();
        return Promise.resolve(deviceData ? deviceData : []);
    }
    return getAllDeviceData(deviceId);
}

async function addDeviceData(
    deviceId: string,
    data: any
): Promise<IDeviceData> {
    const newDeviceDatum = await new DeviceData({
        deviceId: deviceId,
        data: data
    }).save();
    return Promise.resolve(newDeviceDatum);
}

async function removeDeviceData(deviceId: string) {
    await DeviceData.deleteMany({ deviceId: deviceId }).exec();
}

export default {
    getAllDeviceData,
    getMostRecentDeviceData,
    addDeviceData,
    removeDeviceData
};
