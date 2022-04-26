import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";

interface LocationState {
	device: Device;
}

export default function ViewDevice() {
	const { deviceId } = useParams();
	const { state } = useLocation();
	const [device, setDevice] = useState<Device>();
	console.log(JSON.stringify(device, null, 2));

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
			<h3>Device page for {device?.name}!!</h3>
			<br />
			<br />
			<pre>{JSON.stringify(device, null, 2)}</pre>
			TODO: delete, modify, view device data, export device data (csv/json?)
		</div>
	);
}
