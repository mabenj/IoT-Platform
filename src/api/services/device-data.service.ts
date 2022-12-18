import { DeviceData as DeviceDataInterface } from "../../interfaces/device-data.interface";
import { GetDeviceDataResponse } from "../../interfaces/get-device-data-response.interface";
import DeviceData from "../models/device-data.model";
import { getDateString } from "../utils/utils";
import DeviceService from "./device.service";

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

async function exportToJson(deviceId: string) {
    const allDeviceData = await getAllDeviceData(deviceId);
    const deviceName = (await DeviceService.getDevice(deviceId)).name.replace(
        /[^a-z0-9]/gi,
        "_"
    );
    const json = JSON.stringify(allDeviceData);
    const filename = `Device_data_${deviceName}_${getDateString(
        new Date()
    )}.json`;
    return { json, filename };
}

async function getBetween(
    deviceId: string,
    startDate: Date,
    endDate: Date
): Promise<GetDeviceDataResponse> {
    const deviceData =
        (await DeviceData.find({ deviceId })
            .sort({ createdAt: -1 })
            .find({ createdAt: { $gte: startDate, $lt: endDate } })
            .exec()) || [];
    const count = await DeviceData.countDocuments({ deviceId });
    return Promise.resolve({ deviceData, count });
}

export default {
    getAllDeviceData,
    getMostRecentDeviceData,
    addDeviceData,
    removeDeviceData,
    exportToJson,
    getBetween
};
