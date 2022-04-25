import React, { useEffect, useState } from "react";
import { Device } from "../../../../interfaces/device.interface";
import DeviceService from "../../services/DeviceService";

export default function ViewDevices() {
	const [currentDevices, setCurrentDevices] = useState<Device[]>([]);

	useEffect(() => {
		async function fetchDevices() {
			console.log("fetch");
			setCurrentDevices(await DeviceService.getAllDevices());
		}
		fetchDevices();
	}, []);
	return (
		<>
			<h2 className="mb-5">Current Devices</h2>
			{currentDevices.map((device, index) => {
				return (
					<div
						key={index}
						className="mb-5 p-4 bg-light bg-gradient border rounded">
						<div>
							<strong>Name:</strong> {device.name}
						</div>
						<div>
							<strong>Access token:</strong> {device.accessToken}
						</div>
						<div>
							<strong>Created:</strong> {device.createdAt?.toString()}
						</div>
						<div>
							<strong>Last modified:</strong> {device.updatedAt?.toString()}
						</div>
						<div>
							<strong>Protocol:</strong> {device.protocol}
						</div>
						<div>
							<strong>Description:</strong> {device.description || "-"}
						</div>
						<div>
							<strong>Enabled:</strong> {device.enabled ? "Yes" : "No"}
						</div>
					</div>
				);
			})}
		</>
	);
}
