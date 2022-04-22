import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";

export default function Sidenav() {
	const navigate = useNavigate();
	return (
		<ListGroup style={{ position: "fixed", width: "20%" }}>
			<ListGroup.Item action onClick={() => navigate("/viewDevices")}>
				View Devices
			</ListGroup.Item>
			<ListGroup.Item action onClick={() => navigate("/registerDevice")}>
				Register a Device
			</ListGroup.Item>
		</ListGroup>
	);
}
