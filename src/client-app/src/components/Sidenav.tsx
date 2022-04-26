import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

interface SidenavProps {
	className?: string;
}

export default function Sidenav({ className }: SidenavProps) {
	return (
		<div
			className={`mx-2 d-flex flex-column justify-content-between ${className}`}>
			<ListGroup>
				<CustomListGroupItem to="/" label="Home" matchExact />
				<CustomListGroupItem to="/viewDevices" label="View Devices" />
				<CustomListGroupItem to="/registerDevice" label="Register a Device" />
			</ListGroup>
			<span className="mb-4">
				<span className="mdi mdi-github"></span>
				<a
					href="https://github.com/mabenj/IoT-Platform"
					className="mx-2 hover-underline"
					target="_blank"
					rel="noreferrer">
					github.com/mabenj/IoT-Platform
				</a>
			</span>
		</div>
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
	matchExact = false
}: CustomListGroupItemProps) => {
	const resolved = useResolvedPath(to);
	const match = useMatch({ path: resolved.pathname, end: matchExact });
	return (
		<ListGroup.Item as="span" action className="p-0" active={!!match}>
			<Link
				to={to}
				className="text-reset d-inline-block p-2"
				style={{ width: "100%", height: "100%" }}>
				{label}
			</Link>
		</ListGroup.Item>
	);
};
