import React, { useCallback, useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import { useLocation, useParams } from "react-router-dom";
import { DeviceData } from "../../../interfaces/device-data.interface";
import { Device } from "../../../interfaces/device.interface";
import DeviceDataService from "../services/DeviceDataService";
import DeviceService from "../services/DeviceService";
import { range } from "../utils/utils";

interface LocationState {
    device: Device;
}

export default function ViewDeviceData() {
    const [device, setDevice] = useState<Device>();
    const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const { deviceId } = useParams();
    const { state } = useLocation();

    const resolveDeviceAndData = useCallback(async () => {
        setIsFetchingData(true);
        const deviceFromState = (state as LocationState)?.device;
        const currentDevice =
            deviceFromState || (await DeviceService.getDevice(deviceId!));
        const deviceData = await DeviceDataService.getDeviceData(
            currentDevice.id!,
            0,
            20
        );
        setDevice(currentDevice);
        setDeviceData(deviceData);
        setIsFetchingData(false);
    }, [deviceId, state]);

    useEffect(() => {
        async function fetchDeviceAndData() {
            resolveDeviceAndData();
        }
        fetchDeviceAndData();
    }, [resolveDeviceAndData]);

    return (
        <div>
            <h2>Device Data: {device?.name}</h2>
            {!isFetchingData && (
                <pre>{JSON.stringify(deviceData, null, 2)}</pre>
            )}

            {isFetchingData &&
                range(0, 10).map((index) => (
                    <>
                        <DeviceDataPlaceholder key={index} />
                        <br />
                    </>
                ))}
        </div>
    );
}

const DeviceDataPlaceholder = () => {
    const maxWidthPx = 350;
    const minWidthPx = 250;
    return (
        <Placeholder animation="glow" className="my-5">
            <div>
                <Placeholder
                    size="lg"
                    style={{
                        width: `${
                            Math.random() * (maxWidthPx - minWidthPx + 1) +
                            minWidthPx
                        }px`
                    }}
                />
            </div>
            <div>
                <Placeholder
                    size="lg"
                    style={{
                        width: `${
                            Math.random() * (maxWidthPx - minWidthPx + 1) +
                            minWidthPx
                        }px`
                    }}
                />
            </div>
            <div>
                <Placeholder
                    size="lg"
                    style={{
                        width: `${
                            Math.random() * (maxWidthPx - minWidthPx + 1) +
                            minWidthPx
                        }px`
                    }}
                />
            </div>
            <div>
                <Placeholder
                    size="lg"
                    style={{
                        width: `${
                            Math.random() * (maxWidthPx - minWidthPx + 1) +
                            minWidthPx
                        }px`
                    }}
                />
            </div>
            <div>
                <Placeholder
                    size="lg"
                    style={{
                        width: `${
                            Math.random() * (maxWidthPx - minWidthPx + 1) +
                            minWidthPx
                        }px`
                    }}
                />
            </div>
            {/* <span className="d-flex justify-content-between p-2">
                    <Placeholder
                        size="lg"
                        style={{
                            width: `${
                                Math.random() * (maxWidthPx - minWidthPx + 1) +
                                minWidthPx
                            }px`
                        }}
                    />
                    <Placeholder
                        size="lg"
                        style={{
                            width: "70px"
                        }}
                    />
                </span> */}
        </Placeholder>
    );
};
