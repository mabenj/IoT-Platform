import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClientRoutes from "../../routes/routes";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import Sidenav from "../sidenav/Sidenav";
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
							<Breadcrumb />
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
				{ClientRoutes.map(({ path, isIndex, Component }, key) => (
					<Route
						key={key}
						index={isIndex}
						path={path}
						element={<Component />}
					/>
				))}
			</Routes>
		</div>
	);
};

export default App;
