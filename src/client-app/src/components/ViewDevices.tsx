import React, { useContext, useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import { caseInsensitiveSorter, range, timeAgo } from "../utils/utils";
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
            <ListGroup className="shadow-sm">
                {isLoading &&
                    range(1, devices.length || 10).map((index) => (
                        <DevicePlaceholder key={index} />
                    ))}
                {!isLoading &&
                    devices
                        .sort(caseInsensitiveSorter("name"))
                        .map((device) => (
                            <DeviceItem
                                key={device.id}
                                device={device}
                                onDeleteDevice={() =>
                                    setDevices &&
                                    setDevices((prev) =>
                                        prev.filter(
                                            ({ id }) => id !== device.id
                                        )
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
                title={`Description: ${device.description || "empty"}`}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="flex-grow-1">
                        <span className="hover-underline me-2">
                            {device.name}
                        </span>
                        <small className="text-decoration-none text-muted pe-none">
                            <em>
                                Modified{" "}
                                {timeAgo(device.updatedAt || new Date())}
                            </em>
                        </small>
                    </div>
                    <div className="d-flex gap-5">
                        <div className="d-flex gap-2">
                            <div>
                                <Badge
                                    pill
                                    bg={
                                        device.enabled ? "success" : "secondary"
                                    }
                                    className="">
                                    {device.enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            <div>
                                <Badge bg="primary" pill className="">
                                    {device.protocol === "http"
                                        ? "HTTP"
                                        : device.protocol === "coap"
                                        ? "CoAP"
                                        : "Unknown"}
                                </Badge>
                            </div>
                        </div>
                        <Button
                            variant="danger"
                            size="sm"
                            className="hover-filter"
                            onClick={deleteDevice}
                            title="Delete the device">
                            Delete <span className="mdi mdi-delete"></span>
                        </Button>
                    </div>
                </div>
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
