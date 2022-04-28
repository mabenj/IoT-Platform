import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DevicesContext } from "./App";

export default function DeviceBreadcrumb() {
    const { deviceId } = useParams();
    const { devices } = useContext(DevicesContext) || {};
    const [deviceName, setDeviceName] = useState("Loading...");

    useEffect(() => {
        const currentDevice = devices?.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDeviceName(currentDevice.name);
        } else {
            setDeviceName("Unknown Device");
        }
    }, [deviceId, devices]);

    return <span>{deviceName}</span>;
}
