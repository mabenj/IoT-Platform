import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
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
import useDeviceData from "../hooks/useDeviceData";
import DeviceDataService from "../services/DeviceDataService";
import { range, timeAgo } from "../utils/utils";
import { DevicesContext } from "./App";
import TimeSeriesGraph from "./TimeSeriesGraph";
import HoverTooltip from "./ui/HoverTooltip";

const MAX_DATA_CARD_COUNT = 200;
const DEFAULT_DAY_SCALE = 5;

export default function ViewDeviceData() {
    const { devices } = useContext(DevicesContext) || { devices: [] };
    const { deviceId } = useParams();
    const [device, setDevice] = useState<Device>();
    const [isExporting, setIsExporting] = useState(false);
    const {
        currentDataChunk,
        isFetching,
        totalDeviceDataCount,
        updateDeviceDataChunk,
        refreshData
    } = useDeviceData();

    useEffect(() => {
        const currentDevice = devices.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDevice(currentDevice);
            getDeviceData(DEFAULT_DAY_SCALE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceId, devices]);

    const exportData = async () => {
        setIsExporting(true);
        await DeviceDataService.exportAllDeviceData(device?.id!);
        setIsExporting(false);
    };

    const deleteAllData = async () => {
        await DeviceDataService.deleteAllDeviceData(device?.id!).then(() => {
            updateDeviceDataChunk("", 0);
        });
    };

    const getDeviceData = (daysToTake: number) => {
        if (!device?.id) {
            return;
        }
        updateDeviceDataChunk(device.id, daysToTake);
    };

    const confirmDeletePopover = (
        <Popover>
            <Popover.Body>
                <div>
                    Are you sure you want to delete <strong>all</strong> device
                    data? This cannot be undone.
                </div>
                <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button size="sm" variant="secondary">
                        Cancel
                    </Button>
                    <Button size="sm" variant="danger" onClick={deleteAllData}>
                        <span className="mdi mdi-delete"></span> Delete
                    </Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <div>
            <h2>Device Data - {device?.name}</h2>
            <Col xl={10} xxl={8}>
                {device?.hasTimeSeries &&
                    device.timeSeriesConfigurations.length > 0 && (
                        <TimeSeriesGraph
                            deviceId={device.id!}
                        />
                    )}
                <div className="mt-4 d-flex gap-2">
                    <Button
                        onClick={() => device?.id && refreshData(device.id)}
                        disabled={isExporting}>
                        <span className="mdi mdi-reload"></span> Refresh data
                    </Button>
                    <HoverTooltip tooltip="Export all device data as JSON">
                        <Button
                            disabled={
                                currentDataChunk.length < 1 || isExporting
                            }
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
                    </HoverTooltip>
                    <OverlayTrigger
                        trigger="focus"
                        placement="top"
                        overlay={confirmDeletePopover}>
                        <Button
                            disabled={
                                currentDataChunk.length < 1 || isExporting
                            }>
                            <span className="mdi mdi-delete"></span> Delete All
                            Data
                        </Button>
                    </OverlayTrigger>
                </div>
                <small className="text-muted d-block mt-4">
                    Showing {currentDataChunk.length} out of{" "}
                    {totalDeviceDataCount} entries
                </small>
                {!isFetching &&
                    currentDataChunk
                        .slice(0, MAX_DATA_CARD_COUNT)
                        .map((data) => (
                            <DeviceDataCard key={data.id} data={data} />
                        ))}
                {isFetching &&
                    range(0, 10).map((index) => (
                        <React.Fragment key={index}>
                            <DeviceDataPlaceholder />
                            <br />
                        </React.Fragment>
                    ))}
                {device && !isFetching && currentDataChunk.length === 0 && (
                    <Alert variant="warning" className="mt-5">
                        No device data exists for device '
                        <strong>{device.name}</strong>'
                    </Alert>
                )}
                {!isFetching &&
                    totalDeviceDataCount > currentDataChunk.length && (
                        <Alert variant="warning" className="mt-5">
                            Only the first {currentDataChunk.length} entries are
                            shown
                        </Alert>
                    )}
            </Col>
        </div>
    );
}

interface DeviceDataCardProps {
    data: DeviceData;
}

const DeviceDataCard = ({ data }: DeviceDataCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="my-4 shadow-sm">
            <Card.Body>
                <span className="d-flex justify-content-between">
                    <Card.Title>
                        {format(data.createdAt, "yyyy-MM-dd HH:mm:ss")}
                    </Card.Title>
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
                    <small>ID {data.id}</small>
                </Card.Subtitle>
                <Collapse in={isExpanded} className="mt-4">
                    <Card.Text>
                        <ReactJson src={data.data} name={null} />
                    </Card.Text>
                </Collapse>
            </Card.Body>
            <Card.Footer className="text-muted">
                {timeAgo(data.createdAt)} ago
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
