export interface GetDeviceTimeSeriesResponse {
    count: number;
    displayNames: string[];
    units: string[];
    timestamps: number[];
    timeSeriesValues: any[][];
}
