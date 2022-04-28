import React, { useCallback, useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Placeholder from "react-bootstrap/Placeholder";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";
import { DeviceData } from "../../../interfaces/device-data.interface";
import { Device } from "../../../interfaces/device.interface";
import DeviceDataService from "../services/DeviceDataService";
import { range, timeSince } from "../utils/utils";
import { DevicesContext } from "./App";

export default function ViewDeviceData() {
    const [device, setDevice] = useState<Device>();
    const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const { devices } = useContext(DevicesContext) || { devices: [] };
    const { deviceId } = useParams();

    const resolveDeviceAndData = useCallback(async () => {
        setIsFetchingData(true);
        const currentDevice = devices.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDevice(currentDevice);
            const deviceData = await DeviceDataService.getDeviceData(
                currentDevice.id!,
                0,
                20
            );
            setDeviceData(deviceData);
        }
        setIsFetchingData(false);
    }, [deviceId, devices]);

    useEffect(() => {
        async function fetchDeviceAndData() {
            resolveDeviceAndData();
        }
        fetchDeviceAndData();
    }, [resolveDeviceAndData]);

    const exportData = () => {
        // TODO
    };

    return (
        <div>
            <h2>Device Data - {device?.name}</h2>
            <Col sm={8}>
                <Button
                    title="Export all device data as JSON"
                    className="mt-4"
                    disabled={deviceData.length < 1}
                    onClick={() => exportData()}>
                    <span className="mdi mdi-cloud-download"></span> Export JSON
                </Button>
                {!isFetchingData &&
                    deviceData.map((data) => (
                        <DeviceDataCard key={data.id} data={data} />
                    ))}
                {!isFetchingData && deviceData.length === 0 && (
                    <Alert variant="warning" className="mt-5">
                        No device data exists for device '
                        <strong>{device?.name}</strong>'
                    </Alert>
                )}
                {!isFetchingData && deviceData.length > 20 && (
                    <Alert variant="warning" className="mt-5">
                        Only the first 20 entries are shown
                    </Alert>
                )}
            </Col>

            {isFetchingData &&
                range(0, 10).map((index) => (
                    <>
                        <DeviceDataPlaceholder key={index} />
                        <br />
                    </>
                ))}
        </div>
    );
}

interface DeviceDataProps {
    data: DeviceData;
}

const DeviceDataCard = ({ data }: DeviceDataProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="my-4 shadow-sm">
            <Card.Body>
                <span className="d-flex justify-content-between">
                    <Card.Title>{data.createdAt.toLocaleString()}</Card.Title>
                    <Button
                        variant=""
                        as="span"
                        className={
                            isExpanded
                                ? "mdi mdi-chevron-up fs-4"
                                : "mdi mdi-chevron-down fs-4"
                        }
                        size="sm"
                        onClick={() => setIsExpanded((prev) => !prev)}></Button>
                </span>
                <Card.Subtitle className="text-muted">
                    <small>{data.id}</small>
                </Card.Subtitle>
                <Collapse in={isExpanded} className="mt-4">
                    <Card.Text>
                        <ReactJson src={data.data} name={null} />
                    </Card.Text>
                </Collapse>
            </Card.Body>
            <Card.Footer className="text-muted">
                {timeSince(data.createdAt)} ago
            </Card.Footer>
        </Card>
    );
};

const DeviceDataPlaceholder = () => {
    return (
        <Placeholder animation="glow">
            <Card className="my-4 shadow-sm">
                <Card.Body>
                    <Card.Title>
                        <Placeholder
                            size="lg"
                            style={{
                                width: `210px`
                            }}
                        />
                    </Card.Title>
                    <Card.Subtitle className="text-muted">
                        <Placeholder
                            size="lg"
                            style={{
                                width: `200px`
                            }}
                        />
                    </Card.Subtitle>
                </Card.Body>
                <Card.Footer className="text-muted">
                    <Placeholder
                        size="lg"
                        style={{
                            width: `100px`
                        }}
                    />
                </Card.Footer>
            </Card>
        </Placeholder>
    );
};
