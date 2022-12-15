import { format } from "date-fns";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    Badge,
    ButtonGroup,
    Modal,
    OverlayTrigger,
    Popover
} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { DeviceData } from "../../../interfaces/device-data.interface";
import { Device } from "../../../interfaces/device.interface";
import { TimeSeriesConfiguration } from "../../../interfaces/time-series-configuration.interface";
import { useIsMobile } from "../hooks/useIsMobile";
import DeviceDataService from "../services/DeviceDataService";
import { generateHexColor, range, timeAgo } from "../utils/utils";
import { DevicesContext } from "./App";

const CHUNK_SIZE = 200;

const ALL_TIME_DAYS = Number.MAX_VALUE;
const ONE_YEAR = 365;
const ONE_MONTH = 30;
const SIX_MONTHS = 6 * ONE_MONTH;
const ONE_WEEK = 7;

export default function ViewDeviceData() {
    const [device, setDevice] = useState<Device>();
    const [deviceData, setDeviceData] = useState<Map<string, DeviceData>>(
        new Map()
    );
    const [chunkIndexes, setChunkIndexes] = useState<[number, number]>([
        0,
        CHUNK_SIZE
    ]);
    const [totalDeviceDataCount, setTotalDeviceDataCount] = useState(0);
    const [isFetchingData, setIsFetchingData] = useState(true);
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

    const deleteAllData = async () => {
        alert("Not allowed"); //TODO
        // await DeviceDataService.deleteAllDeviceData(device?.id!);
        // setDeviceData(new Map());
        // setTotalDeviceDataCount(0);
    };

    const refreshData = async () => {
        if (!device?.id) {
            return;
        }
        setIsFetchingData(true);
        const { deviceData: newDeviceData, count } =
            await DeviceDataService.getDeviceData(
                device.id,
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
                            deviceData={Array.from(deviceData.values())}
                            timeSeriesConfigs={
                                device?.timeSeriesConfigurations || []
                            }
                            loading={isFetchingData}
                        />
                    )}
                <div className="mt-4 d-flex gap-2">
                    <Button
                        title="Refresh data"
                        onClick={() => refreshData()}
                        disabled={deviceData.size < 1 || isExporting}>
                        <span className="mdi mdi-reload"></span> Refresh data
                    </Button>
                    <Button
                        title="Export all device data as JSON"
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
                    <OverlayTrigger
                        trigger="focus"
                        placement="top"
                        overlay={confirmDeletePopover}>
                        <Button
                            title="Delete all device data"
                            disabled={deviceData.size < 1 || isExporting}>
                            <span className="mdi mdi-delete"></span> Delete All
                            Data
                        </Button>
                    </OverlayTrigger>
                </div>
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
                        <React.Fragment key={index}>
                            <DeviceDataPlaceholder />
                            <br />
                        </React.Fragment>
                    ))}
                {!isFetchingData && deviceData.size === 0 && (
                    <Alert variant="warning" className="mt-5">
                        No device data exists for device '
                        <strong>{device?.name}</strong>'
                    </Alert>
                )}
                {!isFetchingData && totalDeviceDataCount > deviceData.size && (
                    <Alert variant="warning" className="mt-5">
                        Only the first {deviceData.size} entries are shown
                    </Alert>
                )}
            </Col>
        </div>
    );
}

interface TimeSeriesGraphProps {
    deviceData: DeviceData[];
    timeSeriesConfigs: TimeSeriesConfiguration[];
    loading: boolean;
}

const TimeSeriesGraph = ({
    deviceData,
    timeSeriesConfigs,
    loading
}: TimeSeriesGraphProps) => {
    const [showAsModal, setShowAsModal] = useState(false);
    const isMobile = useIsMobile();
    const [yAxisFields, setYAxisFields] = useState<string[]>([]);
    const [units, setUnits] = useState<string[]>([]);
    const [displayNames, setDisplayNames] = useState<string[]>([]);
    const [formattedData, setFormattedData] = useState<Record<string, any>[]>(
        []
    );
    const [scaleInDays, setScaleInDays] = useState(1);

    useEffect(() => {
        const yAxisFields = timeSeriesConfigs.map(
            (config) => config.valueField
        );
        const units = timeSeriesConfigs.map(
            (config) => config.unit || config.valueField
        );
        const displayNames = timeSeriesConfigs.map(
            (config) => config.displayName || config.valueField
        );
        setYAxisFields(yAxisFields);
        setUnits(units);
        setDisplayNames(displayNames);
    }, [timeSeriesConfigs]);

    useEffect(() => {
        const formattedData = deviceData
            .map(({ createdAt, data }) => {
                let formatted: Record<string, any> = {
                    timeStamp: createdAt.getTime()
                };
                yAxisFields.forEach(
                    (field) => (formatted[field] = +data[field])
                );
                return formatted;
            })
            .reverse();
        setFormattedData(formattedData);
    }, [deviceData, yAxisFields]);

    const setScale = (scaleInDays: number) => {
        setScaleInDays(scaleInDays);
        //TODO: fetch and set data
    };

    const formatTimestamp = (timestampMillis: number, longFormat?: boolean) => {
        if (longFormat) {
            return format(new Date(timestampMillis), "yyyy-MM-dd HH:mm");
        }

        //TODO: check distance between last and first timestamp instead of scale
        if (scaleInDays <= 1) {
            return format(new Date(timestampMillis), "HH:mm");
        }
        if (scaleInDays <= ONE_WEEK) {
            return format(new Date(timestampMillis), "yyyy-MM-dd HH:mm");
        }
        if (scaleInDays <= ONE_MONTH) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        if (scaleInDays <= SIX_MONTHS) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        if (scaleInDays <= ONE_YEAR) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        return format(new Date(timestampMillis), "yyyy-MM-dd");
    };

    if (loading) {
        return (
            <div className="w-100 d-flex justify-content-center my-6 mt-5">
                <Spinner variant="primary" />
            </div>
        );
    }

    if (deviceData.length === 0) {
        return (
            <Alert variant="warning" className="my-5">
                No time series data available
            </Alert>
        );
    }

    const latestData = formattedData[formattedData.length - 1];

    const CustomTick = (props: any) => {
        const { x, y, payload } = props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform="rotate(-35)">
                    {formatTimestamp(payload.value)}
                </text>
            </g>
        );
    };

    const Chart = () => (
        <ResponsiveContainer width="100%" height={500} minWidth={500}>
            <LineChart data={formattedData} margin={{ bottom: 80 }}>
                <Line
                    yAxisId={0}
                    type="linear"
                    dataKey={yAxisFields[0]}
                    stroke={generateHexColor(yAxisFields[0])}
                    strokeWidth={1.8}
                    unit={" " + units[0]}
                    legendType="plainline"
                    name={displayNames[0]}
                    dot={false}
                />
                <Line
                    yAxisId={1}
                    type="linear"
                    dataKey={yAxisFields[1]}
                    stroke={generateHexColor(yAxisFields[1])}
                    strokeWidth={1.8}
                    unit={" " + units[1]}
                    legendType="plainline"
                    name={displayNames[1]}
                    dot={false}
                />

                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis
                    dataKey="timeStamp"
                    angle={-10}
                    tickFormatter={(val) => formatTimestamp(val)}
                    tick={<CustomTick />}
                />
                <YAxis
                    yAxisId={0}
                    label={{
                        value: `${displayNames[0]} ${
                            units[0] && `(${units[0]})`
                        }`,
                        angle: -90,
                        position: "insideLeft",
                        offset: 15
                    }}
                />
                <YAxis
                    yAxisId={1}
                    label={{
                        value: `${displayNames[1]} ${
                            units[1] && `(${units[1]})`
                        }`,
                        angle: -90,
                        position: "right",
                        offset: -15
                    }}
                    orientation="right"
                />
                <Tooltip
                    labelFormatter={(value) => formatTimestamp(value, true)}
                />
                <Legend verticalAlign="top" />
            </LineChart>
        </ResponsiveContainer>
    );

    const ScaleButtons = () => (
        <div className="w-100 d-flex justify-content-center my-3">
            <ButtonGroup vertical={isMobile}>
                <Button
                    disabled
                    variant="primary"
                    onClick={() => setScale(ALL_TIME_DAYS)}
                    active={scaleInDays === ALL_TIME_DAYS}>
                    All time
                </Button>
                <Button
                    disabled
                    variant="primary"
                    onClick={() => setScale(ONE_YEAR)}
                    active={scaleInDays === ONE_YEAR}>
                    1 year
                </Button>
                <Button
                    disabled
                    variant="primary"
                    onClick={() => setScale(SIX_MONTHS)}
                    active={scaleInDays === SIX_MONTHS}>
                    6 months
                </Button>
                <Button
                    disabled
                    variant="primary"
                    onClick={() => setScale(ONE_MONTH)}
                    active={scaleInDays === ONE_MONTH}>
                    1 month
                </Button>
                <Button
                    disabled
                    variant="primary"
                    onClick={() => setScale(ONE_WEEK)}
                    active={scaleInDays === ONE_WEEK}>
                    1 week
                </Button>
                <Button
                    variant="primary"
                    onClick={() => setScale(1)}
                    active={scaleInDays === 1}>
                    24 hours
                </Button>
            </ButtonGroup>
        </div>
    );

    return (
        <Card className="my-5">
            <Card.Header>Time Series</Card.Header>
            <Card.Body className="d-flex flex-column align-items-center">
                <div className="iot-time-series-latest-value">
                    <Card.Title>
                        <div className="iot-time-series-title">
                            Latest Value
                        </div>
                    </Card.Title>
                    <Card.Subtitle className="iot-time-series-timestamp">
                        {latestData &&
                            formatTimestamp(latestData["timeStamp"], true)}
                    </Card.Subtitle>
                    <div className="iot-time-series-value1">
                        <span className="font-monospace fs-5">
                            {displayNames[0]}
                        </span>
                        <div>
                            <Badge bg="secondary" className="ms-3 fs-6">
                                {(latestData && latestData[yAxisFields[0]]) +
                                    " " +
                                    units[0]}
                            </Badge>
                        </div>
                    </div>
                    <div className="iot-time-series-value2">
                        <span className="font-monospace fs-5">
                            {displayNames[1]}
                        </span>
                        <div>
                            <Badge bg="secondary" className="ms-3 fs-6">
                                {(latestData && latestData[yAxisFields[1]]) +
                                    " " +
                                    units[1]}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="w-100 h-100 mt-2 d-flex justify-content-center">
                    {isMobile ? (
                        <Button onClick={() => setShowAsModal(true)}>
                            Show graph
                        </Button>
                    ) : (
                        <Chart />
                    )}
                    <Modal
                        show={showAsModal}
                        fullscreen="md-down"
                        onHide={() => setShowAsModal(false)}>
                        <Modal.Header closeButton>
                            Time Series Graph
                        </Modal.Header>
                        <Modal.Body>
                            <Chart />
                            <ScaleButtons />
                        </Modal.Body>
                    </Modal>
                </div>
                {!isMobile && <ScaleButtons />}
            </Card.Body>
        </Card>
    );
};

interface DeviceDataProps {
    data: DeviceData;
}

const DeviceDataCard = ({ data }: DeviceDataProps) => {
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
