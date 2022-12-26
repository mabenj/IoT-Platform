import { DeviceData } from "./device-data.interface";

export interface GetDeviceDataResponse {
    pagination: {
        currentCount: number;
        totalCount: number;
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
    };
    items: DeviceData[];
}
