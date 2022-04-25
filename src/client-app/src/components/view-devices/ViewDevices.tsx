import React, { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
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
			<div className="mb-5">
				<h2 className="d-inline">Current Devices</h2>
				{isLoading && <Spinner animation="border" className="mx-3" />}
			</div>
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
					<Placeholder xs={1} />
				</div>
				<div>
					<Placeholder xs={2} />
				</div>
				<div>
					<Placeholder xs={1} />
				</div>
				<div>
					<Placeholder xs={2} />
				</div>
				<div>
					<Placeholder xs={1} />
				</div>
				<div>
					<Placeholder xs={2} />
				</div>
				<div>
					<Placeholder xs={1} />
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
