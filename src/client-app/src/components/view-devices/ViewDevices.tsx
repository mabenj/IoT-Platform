import axios from "axios";
import React, { useEffect, useState } from "react";
import { Device } from "../../../../interfaces/device.interface";

export default function ViewDevices() {
	const [devices, setDevices] = useState<Device[]>([]);

	useEffect(() => {
		axios.get("/api/devices").then(({ data }) => setDevices(data));
	}, []);

	return (
		<>
			<h3>Current devices</h3>
			{devices.map((device, index) => {
				return (
					<div key={index} className="mb-5">
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
