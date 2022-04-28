import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <h1>IoT Platform</h1>
            <div className="d-flex">
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
                    bg-primary bg-gradient me-4 mt-5 text-light d-flex flex-column 
                    justify-content-center align-items-center hover-filter shadow`}
                style={{ width: "220px", height: "220px" }}>
                <span className={mdiIcon} style={{ fontSize: "100px" }}></span>
                <span className="fs-3">{label}</span>
            </span>
        </Link>
    );
};
