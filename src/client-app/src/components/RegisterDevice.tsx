import React from "react";
import { useNavigate } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import DeviceForm from "./DeviceForm";

export default function RegisterDevice() {
	const navigate = useNavigate();

	const handleSubmit = async (device: Device) => {
		const newDevice = await DeviceService.registerDevice(device);
		navigate(`/viewDevices/${newDevice.id}`, { state: { device: newDevice } });
	};

	return (
		<>
			<h2>Register a New Device</h2>
			<DeviceForm onSubmit={handleSubmit} isCreatingNew />
		</>
	);
}
