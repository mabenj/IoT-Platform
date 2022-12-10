import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { caseInsensitiveSorter } from "../utils/utils";
import { DevicesContext } from "./App";

export default function Home() {
    const { devices } = useContext(DevicesContext) || {
        devices: []
    };
    return (
        <>
            <h1>IoT Platform</h1>
            <div className="d-flex mt-4 gap-4">
                <NavigationPane
                    label="View Devices"
                    linkTo="/viewDevices"
                    mdiIcon="mdi mdi-lan"
                    title="View all the currently registered devices"
                />
                <NavigationPane
                    label="New Device"
                    linkTo="/registerDevice"
                    mdiIcon="mdi mdi-database-plus"
                    title="Register a new device"
                />
            </div>
            <h2 className="mt-5">View Data</h2>
            <ListGroup className="mt-3">
                {devices.sort(caseInsensitiveSorter("name")).map((device) => (
                    <ListGroup.Item action key={device.id}>
                        <Link
                            to={`/viewDevices/${device.id}/viewdata`}
                            state={{ device }}
                            className="hover-underline">
                            <div className="d-flex">
                                <div className="flex-grow-1">{device.name}</div>
                            </div>
                        </Link>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

interface NavigationPaneProps {
    label: string;
    mdiIcon: string;
    linkTo: string;
    title?: string;
}

const NavigationPane = ({
    label,
    mdiIcon,
    linkTo,
    title
}: NavigationPaneProps) => {
    return (
        <Link to={linkTo} title={title}>
            <span
                className={`
                    bg-primary bg-gradient text-light d-flex flex-column 
                    justify-content-center align-items-center hover-filter shadow`}
                style={{ width: "220px", height: "220px" }}>
                <span className={mdiIcon} style={{ fontSize: "100px" }}></span>
                <span className="fs-3">{label}</span>
            </span>
        </Link>
    );
};
