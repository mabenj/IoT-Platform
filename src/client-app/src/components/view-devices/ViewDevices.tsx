import React, { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import { Device } from "../../../../interfaces/device.interface";
import DeviceService from "../../services/DeviceService";

export default function ViewDevices() {
	const [currentDevices, setCurrentDevices] = useState<Device[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchDevices() {
			setCurrentDevices(await DeviceService.getAllDevices());
			setIsLoading(false);
		}
		fetchDevices();
	}, []);
	return (
		<>
			<h2 className="mb-5">Current Devices</h2>
			{isLoading && PLACE_HOLDERS.map((placeholder) => placeholder)}
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

const PlaceholderComponent = () => {
	return (
		<div className="mb-5 p-4 bg-light bg-gradient border rounded">
			<Placeholder animation="glow">
				<div>
					<Placeholder xs={2} /> <Placeholder xs={4} />
				</div>
				<div>
					<Placeholder xs={4} /> <Placeholder xs={4} />
				</div>
				<div>
					<Placeholder xs={3} /> <Placeholder xs={4} />
				</div>
				<div>
					<Placeholder xs={4} /> <Placeholder xs={4} />
				</div>
				<div>
					<Placeholder xs={3} /> <Placeholder xs={2} />
				</div>
				<div>
					<Placeholder xs={4} /> <Placeholder xs={4} />
				</div>
				<div>
					<Placeholder xs={2} /> <Placeholder xs={2} />
				</div>
			</Placeholder>
		</div>
	);
};

const PLACE_HOLDERS = [
	<PlaceholderComponent />,
	<PlaceholderComponent />,
	<PlaceholderComponent />,
	<PlaceholderComponent />
];
