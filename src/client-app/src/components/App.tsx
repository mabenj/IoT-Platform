import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
    BrowserRouter as Router,
    Outlet,
    Route,
    Routes
} from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import ClientRoutes from "../routes/routes";
import DeviceService from "../services/DeviceService";
import Breadcrumb from "./Breadcrumb";
import Sidenav from "./Sidenav";

interface IDevicesContext {
    devices: Device[];
    setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
}

export const DevicesContext = React.createContext<IDevicesContext | null>(null);

function App() {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        async function fetchDevices() {
            setDevices(await DeviceService.getAllDevices());
        }
        fetchDevices();
    }, [setDevices]);

    return (
        <Router>
            <Container fluid>
                <Row className="mt-5">
                    <Sidenav className="sidenav" />
                    <main className="main-content">
                        <DevicesContext.Provider
                            value={{ devices, setDevices }}>
                            <MainContent />
                        </DevicesContext.Provider>
                    </main>
                </Row>
            </Container>
        </Router>
    );
}

const MainContent = () => {
    return (
        <Routes>
            <Route
                element={
                    <>
                        <Breadcrumb />
                        <Outlet />
                    </>
                }>
                {ClientRoutes.map(({ path, isIndex, Component }, key) => (
                    <Route
                        key={key}
                        index={isIndex}
                        path={path}
                        element={<Component />}
                    />
                ))}
            </Route>
        </Routes>
    );
};

export default App;
