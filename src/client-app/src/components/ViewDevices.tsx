import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import { range, sortAlphabetically, timeSince } from "../utils/utils";
import { DevicesContext } from "./App";

export default function ViewDevices() {
    const { devices, setDevices } = useContext(DevicesContext) || {
        devices: []
    };
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDevices() {
            setDevices && setDevices(await DeviceService.getAllDevices());
            setIsLoading(false);
        }
        fetchDevices();
    }, [setDevices]);

    return (
        <>
            <div className="mb-5">
                <h2 className="d-inline">Registered Devices</h2>
                {isLoading && <Spinner animation="border" className="mx-3" />}
            </div>
            <ListGroup>
                {isLoading &&
                    range(1, devices.length || 10).map((index) => (
                        <DevicePlaceholder key={index} />
                    ))}
                {!isLoading &&
                    sortAlphabetically(devices, "name").map((device) => (
                        <DeviceItem
                            key={device.id}
                            device={device}
                            onDeleteDevice={() =>
                                setDevices &&
                                setDevices((prev) =>
                                    prev.filter(({ id }) => id !== device.id)
                                )
                            }
                        />
                    ))}
                {devices.length < 1 && !isLoading && (
                    <Alert variant="warning">
                        No registered devices could be found — Register a new
                        device{" "}
                        <Alert.Link as="span">
                            <Link
                                to="/registerDevice"
                                className="text-reset hover-underline">
                                here
                            </Link>
                        </Alert.Link>
                    </Alert>
                )}
            </ListGroup>
        </>
    );
}

interface DeviceCardProps {
    device: Device;
    onDeleteDevice: () => void;
}

const DeviceItem = ({ device, onDeleteDevice }: DeviceCardProps) => {
    const deleteDevice = async (event: React.MouseEvent) => {
        event.preventDefault();
        onDeleteDevice();
        DeviceService.deleteDevice(device.id!);
    };

    return (
        <ListGroup.Item action>
            <Link
                to={`/viewDevices/${device.id}`}
                state={{ device }}
                title={device.description}>
                <span className="d-flex justify-content-between">
                    <span className="flex-grow-1">
                        <span
                            className="d-inline-block"
                            style={{ width: "5%", minWidth: "80px" }}>
                            <Badge
                                pill
                                bg={device.enabled ? "success" : "secondary"}
                                className="me-3">
                                {device.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                        </span>
                        <span
                            className="d-inline-block"
                            style={{ width: "5%", minWidth: "80px" }}>
                            <Badge
                                bg={
                                    device.protocol === "http"
                                        ? "primary"
                                        : "info"
                                }
                                pill>
                                {device.protocol === "http"
                                    ? "HTTP"
                                    : device.protocol === "coap"
                                    ? "CoAP"
                                    : "Unknown"}
                            </Badge>
                        </span>
                        <span
                            className="d-inline-block"
                            style={{ width: "20%", minWidth: "80px" }}>
                            <span className="hover-underline">
                                {device.name}
                            </span>
                        </span>
                        <span className="d-inline-block">
                            <small className="text-decoration-none text-muted pe-none">
                                <em>
                                    Modified{" "}
                                    {timeSince(device.updatedAt || new Date())}{" "}
                                    ago
                                </em>
                            </small>
                        </span>
                    </span>

                    <span className="d-inline-block">
                        <Badge
                            className="hover-filter"
                            bg="danger"
                            onClick={deleteDevice}
                            title="Delete the device">
                            Delete <span className="mdi mdi-delete"></span>
                        </Badge>
                    </span>
                </span>
            </Link>
        </ListGroup.Item>
    );
};

const DevicePlaceholder = () => {
    return (
        <ListGroup.Item>
            <Placeholder animation="glow">
                <span className="d-flex justify-content-between">
                    <span className="flex-grow-1">
                        <span
                            className="d-inline-block"
                            style={{ width: "5%", minWidth: "80px" }}>
                            <Placeholder
                                size="lg"
                                style={{
                                    width: "50px"
                                }}
                            />
                        </span>
                        <span
                            className="d-inline-block"
                            style={{ width: "5%", minWidth: "80px" }}>
                            <Placeholder
                                size="lg"
                                style={{
                                    width: "50px"
                                }}
                            />
                        </span>
                        <span
                            className="d-inline-block"
                            style={{ width: "20%", minWidth: "80px" }}>
                            <Placeholder
                                size="lg"
                                style={{
                                    width: `${
                                        Math.random() * (190 - 270 + 1) + 190
                                    }px`
                                }}
                            />
                        </span>
                        <span className="d-inline-block">
                            <Placeholder
                                size="lg"
                                style={{
                                    width: `${
                                        Math.random() * (150 - 180 + 1) + 150
                                    }px`
                                }}
                            />
                        </span>
                    </span>

                    <span className="d-inline-block">
                        <Placeholder
                            size="lg"
                            style={{
                                width: "70px"
                            }}
                        />
                    </span>
                </span>
            </Placeholder>
        </ListGroup.Item>
    );
};
