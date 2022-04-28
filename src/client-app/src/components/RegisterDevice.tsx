import React, { useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import { DevicesContext } from "./App";
import DeviceForm from "./DeviceForm";

export default function RegisterDevice() {
    const [error, setError] = useState<Error>();
    const { setDevices } = useContext(DevicesContext) || {};
    const navigate = useNavigate();

    const handleSubmit = async (device: Device) => {
        try {
            const newDevice = await DeviceService.registerDevice(device);
            setDevices && setDevices((prev) => [...prev, newDevice]);
            navigate(`/viewDevices/${newDevice.id}`);
        } catch (error) {
            setError(error as Error);
        }
    };

    return (
        <>
            <h2>Register a New Device</h2>
            <DeviceForm onSubmit={handleSubmit} isCreatingNew />
            {error && (
                <Alert variant="danger" className="mt-5">
                    <span>Error registering the device: {error?.message}</span>
                </Alert>
            )}
        </>
    );
}
