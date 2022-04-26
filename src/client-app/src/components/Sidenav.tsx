import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

interface SidenavProps {
	className?: string;
}

export default function Sidenav({ className }: SidenavProps) {
	return (
		<ListGroup className={`mx-2 ${className}`}>
			<CustomListGroupItem to="/" label="Home" matchExact />
			<CustomListGroupItem to="/viewDevices" label="View Devices" />
			<CustomListGroupItem to="/registerDevice" label="Register a Device" />
		</ListGroup>
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
