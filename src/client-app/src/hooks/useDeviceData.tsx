import { subDays } from "date-fns";
import { useState } from "react";
import { DeviceData } from "../../../interfaces/device-data.interface";
import DeviceDataService from "../services/DeviceDataService";

export default function useDeviceData() {
    const [deviceDataStore, setDeviceDataStore] = useState<DeviceData[]>([]);
    const [currentDataChunk, setCurrentDataChunk] = useState<DeviceData[]>([]);
    const [latestDaysToTake, setLatestDaysToTake] = useState(0);
    const [totalDeviceDataCount, setTotalDeviceDataCount] = useState(0);
    const [timestampOfOldest, setTimestampOfOldest] = useState(
        new Date().getTime()
    );
    const [isFetching, setIsFetching] = useState(false);

    const updateDeviceDataChunk = async (
        deviceId: string,
        daysToTake: number,
        takeUntil?: Date
    ) => {
        setLatestDaysToTake(daysToTake);
        const startDate = subDays(new Date(), daysToTake);
        const endDate = takeUntil ?? new Date(timestampOfOldest);
        if (startDate.getTime() >= timestampOfOldest) {
            console.log("start bigger than oldest");
            setCurrentDataChunk(
                deviceDataStore.filter((data) => data.createdAt >= startDate)
            );
            return;
        }
        console.log("fetching data");
        setIsFetching(true);
        const data = await DeviceDataService.getDeviceDataByDate(
            deviceId,
            startDate,
            endDate
        );
        console.log("got: ", data.deviceData);
        setDeviceDataStore((prev) => {
            const newValues = removeDuplicates(
                [...prev, ...data.deviceData],
                "id"
            ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            setTimestampOfOldest(
                (prev) => newValues[0]?.createdAt.getTime() ?? prev
            );
            setCurrentDataChunk(
                newValues.filter((data) => data.createdAt >= startDate)
            );
            setIsFetching(false);
            return newValues;
        });
        setTotalDeviceDataCount(data.count);
    };

    const refreshData = (deviceId: string) => {
        updateDeviceDataChunk(deviceId, latestDaysToTake, new Date())
    }

    return {
        currentDataChunk,
        totalDeviceDataCount,
        isFetching,
        updateDeviceDataChunk,
        refreshData
    } as const;
}

function removeDuplicates(deviceData: DeviceData[], field: keyof DeviceData) {
    return deviceData.filter((deviceDatum, index) => {
        return (
            deviceData.findIndex((d) => d[field] === deviceDatum[field]) ===
            index
        );
    });
}
