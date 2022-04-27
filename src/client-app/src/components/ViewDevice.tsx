import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";

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

    return (
        <div>
            <h3>Device: {device?.name}</h3>
            <br />
            <h1>
                <Link to={`/viewDevices/${device?.id}/viewdata`}>
                    <Badge>View Data</Badge>
                </Link>
            </h1>
            <br />
            <pre>{JSON.stringify(device, null, 2)}</pre>
            TODO: delete, modify, view device data, export device data
            (csv/json?)
        </div>
    );
}
