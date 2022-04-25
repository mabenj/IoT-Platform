import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

export default function Sidenav() {
	return (
		<ListGroup style={{ position: "fixed", width: "20%" }}>
			<CustomListGroupItem to="/viewDevices" label="View Devices" />
			<CustomListGroupItem to="/registerDevice" label="Register a Device" />
		</ListGroup>
	);
}

const CustomListGroupItem = ({ to, label }: { to: string; label: string }) => {
	const navigate = useNavigate();
	let resolved = useResolvedPath(to);
	let match = useMatch({ path: resolved.pathname, end: true });
	return (
		<ListGroup.Item action active={!!match} onClick={() => navigate(to)}>
			<span>{label}</span>
		</ListGroup.Item>
	);
};
