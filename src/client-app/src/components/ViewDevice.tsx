import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import { DevicesContext } from "./App";
import DeviceForm from "./DeviceForm";

export default function ViewDevice() {
    const [device, setDevice] = useState<Device>();
    const { devices, setDevices } = useContext(DevicesContext) || {
        devices: []
    };
    const { deviceId } = useParams();

    useEffect(() => {
        const currentDevice = devices.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDevice(currentDevice);
        }
    }, [deviceId, devices]);

    const updateDevice = async (newDevice: Device) => {
        const resultDevice = await DeviceService.modifyDevice(newDevice);
        if (resultDevice) {
            setDevice(resultDevice);
            setDevices &&
                setDevices((prev) => {
                    const filtered = prev.filter(
                        ({ id }) => id !== resultDevice.id
                    );
                    return [...filtered, resultDevice];
                });
        }
    };

    return (
        <div>
            <h2>Device Configuration</h2>
            <DeviceForm initialDevice={device} onSubmit={updateDevice} />
        </div>
    );
}
