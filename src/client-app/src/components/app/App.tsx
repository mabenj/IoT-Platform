import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterDevice from "../register-device/RegisterDevice";
import Sidenav from "../sidenav/Sidenav";
import ViewDevices from "../view-devices/ViewDevices";
import "./App.css";

function App() {
	return (
		<Router>
			<Container fluid>
				<Row className="mt-5">
					<Col xs={3}>
						<Sidenav />
					</Col>
					<Col>
						<Container>
							<MainContent />
						</Container>
					</Col>
				</Row>
			</Container>
		</Router>
	);
}

const MainContent = () => {
	return (
		<div className="">
			<Routes>
				<Route path="/">
					<Route index element={<h2>IoT-Platform</h2>}></Route>
					<Route path="viewDevices" element={<ViewDevices />}></Route>
					<Route path="registerDevice" element={<RegisterDevice />}></Route>
					<Route path="*" element={<h2>Not Found</h2>} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
