import React from "react";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<Alert variant="danger">
			<Alert.Heading>This page does not exist!</Alert.Heading>
			<hr />
			Back to{" "}
			<Alert.Link as="span">
				<Link to="/" className="text-reset hover-underline">
					frontpage
				</Link>
			</Alert.Link>
		</Alert>
	);
}
