import React, { useCallback, useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";
import { DeviceData } from "../../../interfaces/device-data.interface";
import { Device } from "../../../interfaces/device.interface";
import DeviceDataService from "../services/DeviceDataService";
import { range, timeSince } from "../utils/utils";
import { DevicesContext } from "./App";

const CHUNK_SIZE = 20;

export default function ViewDeviceData() {
    const [device, setDevice] = useState<Device>();
    const [deviceData, setDeviceData] = useState<Map<string, DeviceData>>(
        new Map()
    );
    const [chunkIndexes, setChunkIndexes] = useState<[number, number]>([0, 20]);
    const [totalDeviceDataCount, setTotalDeviceDataCount] = useState(0);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { devices } = useContext(DevicesContext) || { devices: [] };
    const { deviceId } = useParams();

    const fetchDeviceDataChunk = useCallback(
        async (deviceId: string) => {
            if (
                deviceData.size === totalDeviceDataCount &&
                totalDeviceDataCount > 0
            ) {
                return;
            }
            setIsFetchingData(true);
            const { deviceData: newDeviceData, count } =
                await DeviceDataService.getDeviceData(
                    deviceId,
                    chunkIndexes[0],
                    chunkIndexes[1]
                );
            setDeviceData((prev) => {
                newDeviceData.forEach((data) => prev.set(data.id, data));
                return prev;
            });
            setChunkIndexes((prev) => [
                Math.min(prev[0] + CHUNK_SIZE + 1, count),
                Math.min(prev[1] + CHUNK_SIZE + 1, count)
            ]);
            setTotalDeviceDataCount(count);
            setIsFetchingData(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const resolveDeviceAndData = useCallback(async () => {
        const currentDevice = devices.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDevice(currentDevice);
            fetchDeviceDataChunk(currentDevice.id!);
        }
    }, [deviceId, devices, fetchDeviceDataChunk]);

    useEffect(() => {
        async function fetchDeviceAndData() {
            resolveDeviceAndData();
        }
        fetchDeviceAndData();
    }, [resolveDeviceAndData]);

    const exportData = async () => {
        setIsExporting(true);
        await DeviceDataService.exportAllDeviceData(device?.id!);
        setIsExporting(false);
    };

    return (
        <div>
            <h2>Device Data - {device?.name}</h2>
            <Col sm={8}>
                <Button
                    title="Export all device data as JSON"
                    className="mt-4"
                    disabled={deviceData.size < 1 || isExporting}
                    onClick={() => exportData()}>
                    {isExporting ? (
                        <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                        />
                    ) : (
                        <span className="mdi mdi-cloud-download"></span>
                    )}{" "}
                    Export JSON
                </Button>
                <small className="text-muted d-block mt-4">
                    Showing {deviceData.size} out of {totalDeviceDataCount}{" "}
                    entries
                </small>
                {!isFetchingData &&
                    Array.from(deviceData.values()).map((data) => (
                        <DeviceDataCard key={data.id} data={data} />
                    ))}
                {isFetchingData &&
                    range(0, 10).map((index) => (
                        <>
                            <DeviceDataPlaceholder key={index} />
                            <br />
                        </>
                    ))}
                {!isFetchingData && deviceData.size === 0 && (
                    <Alert variant="warning" className="mt-5">
                        No device data exists for device '
                        <strong>{device?.name}</strong>'
                    </Alert>
                )}
                {!isFetchingData && totalDeviceDataCount > 20 && (
                    <Alert variant="warning" className="mt-5">
                        Only the first {deviceData.size} entries are shown
                    </Alert>
                )}
            </Col>
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
        <Card className="shadow-sm">
            <Placeholder animation="glow">
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
            </Placeholder>
        </Card>
    );
};
