import axios from "axios";
import { GetDeviceDataResponse } from "../../../interfaces/get-device-data-response.interface";

async function getDeviceData(
    deviceId: string,
    start?: number,
    stop?: number
): Promise<GetDeviceDataResponse> {
    const response = await axios.get<GetDeviceDataResponse>(
        `/api/deviceData/${deviceId}?start=${start}&stop=${stop}`
    );
    return {
        ...response.data,
        deviceData: response.data.deviceData.map((deviceDatum) => ({
            ...deviceDatum,
            createdAt: new Date(deviceDatum.createdAt)
        }))
    };
}

async function getDeviceDataByDate(
    deviceId: string,
    startDate: Date,
    stopDate: Date
): Promise<GetDeviceDataResponse> {
    const response = await axios.get<GetDeviceDataResponse>(
        `/api/deviceData/${deviceId}?startDate=${startDate.toISOString()}&endDate=${stopDate.toISOString()}`
    );
    return {
        ...response.data,
        deviceData: response.data.deviceData.map((deviceDatum) => ({
            ...deviceDatum,
            createdAt: new Date(deviceDatum.createdAt)
        }))
    };
}

async function exportAllDeviceData(deviceId: string) {
    const response = await axios.get(`/api/deviceData/${deviceId}/exportJson`, {
        responseType: "blob"
    });
    const filename = response.headers["content-disposition"]
        .split("filename=")[1]
        .split(".")[0];
    const extension = response.headers["content-disposition"]
        .split(".")[1]
        .split(";")[0];
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${filename}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function deleteAllDeviceData(deviceId: string) {
    await axios.delete(`/api/deviceData/${deviceId}`);
}

const DeviceDataService = {
    getDeviceData,
    deleteAllDeviceData,
    exportAllDeviceData,
    getDeviceDataByDate
};

export default DeviceDataService;
