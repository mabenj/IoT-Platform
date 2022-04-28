import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import DeviceForm from "./DeviceForm";

interface LocationState {
    device: Device;
}

export default function ViewDevice() {
    const { deviceId } = useParams();
    const { state } = useLocation();
    const [device, setDevice] = useState<Device>();

    useEffect(() => {
        async function fetchDevice() {
            setDevice(await DeviceService.getDevice(deviceId || ""));
        }
        const deviceFromState = (state as LocationState)?.device;
        if (!deviceFromState) {
            fetchDevice();
        } else {
            setDevice(deviceFromState);
        }
    }, [deviceId, state]);

    const updateDevice = async (newDevice: Device) => {
        const resultDevice = await DeviceService.modifyDevice(newDevice);
        if (resultDevice) {
            setDevice(resultDevice);
        }
    };

    return (
        <div>
            <h2>Device: {device?.name}</h2>
            <DeviceForm initialDevice={device} onSubmit={updateDevice} />
        </div>
    );
}
