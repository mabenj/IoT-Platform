import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";

interface LocationState {
    device: Device;
}

export default function DeviceBreadcrumb() {
    const { deviceId } = useParams();
    const { state } = useLocation();
    const [device, setDevice] = useState<Device>();

    useEffect(() => {
        const deviceFromState = (state as LocationState)?.device;
        if (deviceFromState) {
            setDevice(deviceFromState);
        }
    }, [deviceId, state]);

    return <span>{device?.name || "Unknown Device"}</span>;
}
