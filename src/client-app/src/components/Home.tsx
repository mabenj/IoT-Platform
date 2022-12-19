import { useContext } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { caseInsensitiveSorter } from "../utils/utils";
import { DevicesContext } from "./App";
import HoverTooltip from "./ui/HoverTooltip";

export default function Home() {
    const { devices, fetchingDevices } = useContext(DevicesContext) || {
        devices: []
    };
    return (
        <>
            <h1>IoT Platform</h1>
            <div className="d-flex flex-wrap mt-4 gap-4">
                <NavigationPane
                    label="View Devices"
                    linkTo="/viewDevices"
                    mdiIcon="mdi mdi-lan"
                    tooltip="View all the currently registered devices"
                />
                <NavigationPane
                    label="New Device"
                    linkTo="/registerDevice"
                    mdiIcon="mdi mdi-database-plus"
                    tooltip="Register a new device"
                />
            </div>
            <h2 className="mt-5">View Data</h2>
            {fetchingDevices && (
                <div className="d-flex align-items-center gap-3 my-4">
                    <Spinner size="sm" /> Loading data...
                </div>
            )}
            <ListGroup className="mt-3">
                {devices.sort(caseInsensitiveSorter("name")).map((device) => (
                    <ListGroup.Item action key={device.id}>
                        <div className="d-flex gap-3">
                            <span className="mdi mdi-chart-bar"></span>
                            <Link
                                to={`/viewDevices/${device.id}/viewdata`}
                                state={{ device }}
                                className="hover-underline">
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        {device.name}
                                    </div>
                                </div>
                            </Link>
                        </div>
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
    tooltip?: string;
}

const NavigationPane = ({
    label,
    mdiIcon,
    linkTo,
    tooltip
}: NavigationPaneProps) => {
    return (
        <HoverTooltip tooltip={tooltip}>
            <Link to={linkTo}>
                <span
                    className={`
                bg-primary bg-gradient text-light d-flex flex-column 
                justify-content-center align-items-center hover-filter shadow`}
                    style={{ width: "220px", height: "220px" }}>
                    <span
                        className={mdiIcon}
                        style={{ fontSize: "100px" }}></span>
                    <span className="fs-3">{label}</span>
                </span>
            </Link>
        </HoverTooltip>
    );
};
