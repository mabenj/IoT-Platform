import { DeviceData } from "./device-data.interface";

export interface GetDeviceDataResponse {
    count: number;
    page: number;
    pages: number;
    deviceData: DeviceData[];
}
