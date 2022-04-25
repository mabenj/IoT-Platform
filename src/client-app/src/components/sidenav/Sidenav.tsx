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

interface CustomListGroupItemProps {
    to: string;
    label: string;
}

const CustomListGroupItem = ({ to, label }: CustomListGroupItemProps) => {
	const navigate = useNavigate();
	let resolved = useResolvedPath(to);
	let match = useMatch({ path: resolved.pathname, end: true });
	return (
		<ListGroup.Item action active={!!match} onClick={() => navigate(to)}>
			<span>{label}</span>
		</ListGroup.Item>
	);
};
