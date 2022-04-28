import { DeviceData } from "./device-data.interface";

export interface GetDeviceDataResponse {
    deviceData: DeviceData[];
    count: number;
}
