import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import DeviceForm from "./DeviceForm";

export default function RegisterDevice() {
	const [error, setError] = useState<Error>();
	const navigate = useNavigate();

	const handleSubmit = async (device: Device) => {
		try {
			const newDevice = await DeviceService.registerDevice(device);
			navigate(`/viewDevices/${newDevice.id}`, {
				state: { device: newDevice }
			});
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
