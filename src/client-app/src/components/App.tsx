import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Outlet,
    Route,
    Routes
} from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import { useIsMobile } from "../hooks/useIsMobile";
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
    const isMobile = useIsMobile();
    const [devices, setDevices] = useState<Device[]>([]);
    const [sidebarExpanded, setSidebarExpanded] = useState(!isMobile);

    useEffect(() => {
        async function fetchDevices() {
            setDevices(await DeviceService.getAllDevices());
        }
        fetchDevices();
    }, [setDevices]);

    return (
        <Router>
            <Sidenav
                isExpanded={sidebarExpanded}
                toggleExpanded={() => setSidebarExpanded((prev) => !prev)}
            />
            <main
                className={`iot-main-content ${
                    sidebarExpanded && "iot-main-content-padded"
                }`}>
                <DevicesContext.Provider value={{ devices, setDevices }}>
                    <MainContent />
                </DevicesContext.Provider>
            </main>
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
