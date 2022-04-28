import React from "react";
import { useLocation } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";

interface LocationState {
    device: Device;
}

export default function DeviceBreadcrumb() {
    const { state } = useLocation();
    const deviceFromState = (state as LocationState)?.device;
    return <span>{deviceFromState.name}</span>;
}
