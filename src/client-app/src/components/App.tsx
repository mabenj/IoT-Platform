import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClientRoutes from "../routes/routes";
import Breadcrumb from "./Breadcrumb";
import Sidenav from "./Sidenav";

function App() {
	return (
		<Router>
			<Container fluid>
				<Row className="mt-5">
					<Sidenav className="sidenav" />
					<main className="main-content">
						<Breadcrumb />
						<MainContent />
					</main>
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
