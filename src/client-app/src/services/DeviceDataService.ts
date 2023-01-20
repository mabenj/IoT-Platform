import axios from "axios";
import { GetDeviceDataResponse } from "../../../interfaces/get-device-data-response.interface";
import { GetDeviceTimeSeriesResponse } from "../../../interfaces/get-device-time-series-response.interface";

async function getDeviceData(
    deviceId: string,
    page: number
): Promise<GetDeviceDataResponse> {
    const response = await axios.get<GetDeviceDataResponse>(
        `/api/deviceData/${deviceId}?page=${page || 1}`
    );
    return {
        ...response.data,
        items: response.data.items.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt)
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

async function getDeviceTimeSeries(deviceId: string, start: Date, end: Date) {
    const response = await axios.get<GetDeviceTimeSeriesResponse>(
        `/api/deviceData/${deviceId}/timeSeries?start=${start.getTime()}&end=${end.getTime()}`
    );
    return {
        ...response.data,
        timeSeriesValues: response.data.timeSeriesValues.map((values) =>
            values.map((value) => +value)
        )
    } as GetDeviceTimeSeriesResponse;
}

const DeviceDataService = {
    getDeviceData,
    deleteAllDeviceData,
    exportAllDeviceData,
    getDeviceTimeSeries
};

export default DeviceDataService;
