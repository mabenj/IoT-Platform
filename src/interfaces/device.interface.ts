import { TimeSeriesConfiguration } from "./time-series-configuration.interface";

export interface Device {
    name: string;
    accessToken: string;
    enabled: boolean;
    protocol: "http" | "coap";
    description: string;
    hasTimeSeries: boolean;
    timeSeriesConfigurations: TimeSeriesConfiguration[];
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
