import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

export default function Sidenav() {
	return (
		<Card style={{ position: "fixed", width: "20%" }}>
			<ListGroup variant="flush">
				<CustomListGroupItem to="/" label="Home" matchExact />
				<CustomListGroupItem to="/viewDevices" label="View Devices" />
				<CustomListGroupItem to="/registerDevice" label="Register a Device" />
			</ListGroup>
		</Card>
	);
}

interface CustomListGroupItemProps {
	to: string;
	label: string;
	matchExact?: boolean;
}

const CustomListGroupItem = ({
	to,
	label,
	matchExact
}: CustomListGroupItemProps) => {
	const navigate = useNavigate();
	const resolved = useResolvedPath(to);
	const match = useMatch({ path: resolved.pathname, end: matchExact });
	return (
		<ListGroup.Item action active={!!match} onClick={() => navigate(to)}>
			<span>{label}</span>
		</ListGroup.Item>
	);
};
