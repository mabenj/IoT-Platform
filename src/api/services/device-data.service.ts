import { DeviceData as DeviceDataInterface } from "../../interfaces/device-data.interface";
import { GetDeviceDataResponse } from "../../interfaces/get-device-data-response.interface";
import DeviceData from "../models/device-data.model";

async function getAllDeviceData(
    deviceId: string
): Promise<GetDeviceDataResponse> {
    const deviceData = (await DeviceData.find({ deviceId }).exec()) || [];
    return Promise.resolve({ deviceData, count: deviceData.length });
}

async function getMostRecentDeviceData(
    deviceId: string,
    start?: number,
    stop?: number
): Promise<GetDeviceDataResponse> {
    if (start && stop) {
        const deviceData =
            (await DeviceData.find({ deviceId })
                .sort({ createdAt: -1 })
                .limit(stop)
                .skip(start)
                .exec()) || [];
        const count = await DeviceData.countDocuments({ deviceId });
        return Promise.resolve({ deviceData, count });
    }
    return getAllDeviceData(deviceId);
}

async function addDeviceData(
    deviceId: string,
    data: any
): Promise<DeviceDataInterface> {
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
