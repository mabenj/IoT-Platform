import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

interface SidenavProps {
    isExpanded: boolean;
    toggleExpanded: () => any;
}

export default function Sidenav({ isExpanded, toggleExpanded }: SidenavProps) {
    return (
        <div className={`iot-sidebar ${isExpanded && "iot-sidebar-expanded"}`}>
            <div className="w-full d-flex justify-content-end m-1">
                <Button
                    size="lg"
                    onClick={toggleExpanded}
                    className="iot-sidebar-btn">
                    {isExpanded ? (
                        <span className="mdi mdi-chevron-left"></span>
                    ) : (
                        <span className="mdi mdi-chevron-right"></span>
                    )}
                </Button>
            </div>
            <ListGroup variant="flush">
                <SidebarItem
                    matchExact
                    isExpanded={isExpanded}
                    icon="mdi mdi-home"
                    label="Home"
                    to="/"
                />

                <SidebarItem
                    isExpanded={isExpanded}
                    icon="mdi mdi-lan"
                    label="Devices"
                    to="/viewDevices"
                />

                <SidebarItem
                    isExpanded={isExpanded}
                    icon="mdi mdi-database-plus"
                    label="New Device"
                    to="/registerDevice"
                />

                <SidebarItem
                    isExpanded={isExpanded}
                    icon="mdi mdi-github"
                    label="mabenj"
                    to="https://github.com/mabenj/IoT-Platform"
                />
            </ListGroup>
        </div>
    );
}

interface SidebarItemProps {
    matchExact?: boolean;
    to: string;
    label: string;
    icon: string;
    isExpanded: boolean;
}

const SidebarItem = ({
    to,
    label,
    icon,
    isExpanded,
    matchExact = false
}: SidebarItemProps) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: matchExact });

    const Contents = () => (
        <div className="d-flex align-items-center">
            <span className={"fs-4 " + icon}></span>
            <span
                className={`iot-sidebar-label ${
                    isExpanded && "iot-sidebar-label-expanded"
                }`}>
                {label}
            </span>
        </div>
    );

    return (
        <ListGroupItem action active={!!match} title={label}>
            <div className="ms-1">
                {to.startsWith("http") ? (
                    <a href={to} target="_blank" rel="noreferrer">
                        <Contents />
                    </a>
                ) : (
                    <Link to={to}>
                        <Contents />
                    </Link>
                )}
            </div>
        </ListGroupItem>
    );
};
