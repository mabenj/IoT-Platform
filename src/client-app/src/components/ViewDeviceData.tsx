import { format } from "date-fns";
import { useCallback, useContext, useEffect, useState } from "react";
import { Badge, ButtonGroup } from "react-bootstrap";
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
import DeviceDataService from "../services/DeviceDataService";
import { range, timeSince } from "../utils/utils";
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
        await DeviceDataService.deleteAllDeviceData(device?.id!);
        setDeviceData(new Map());
        setTotalDeviceDataCount(0);
    };

    return (
        <div>
            <h2>Device Data - {device?.name}</h2>
            <Col sm={8}>
                <div className="mt-4">
                    <Button
                        title="Export all device data as JSON"
                        disabled={deviceData.size < 1 || isExporting}
                        className="me-3"
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
                    <Button
                        title="Delete all device data"
                        onClick={() => deleteAllData()}
                        disabled={deviceData.size < 1 || isExporting}>
                        <span className="mdi mdi-delete"></span> Delete All Data
                    </Button>
                </div>
                {device?.hasTimeSeries && false ? (
                    <TimeSeriesGraph
                        deviceData={Array.from(deviceData.values())}
                        timeSeriesConfigs={
                            device?.timeSeriesConfigurations || []
                        }
                        loading={isFetchingData}
                    />
                ) : (
                    <>
                        <TimeSeriesGraph
                            deviceData={Array.from(deviceData.values())}
                            timeSeriesConfigs={
                                device?.timeSeriesConfigurations || []
                            }
                            loading={isFetchingData}
                        />
                        <small className="text-muted d-block mt-4">
                            Showing {deviceData.size} out of{" "}
                            {totalDeviceDataCount} entries
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
                        {!isFetchingData &&
                            totalDeviceDataCount > deviceData.size && (
                                <Alert variant="warning" className="mt-5">
                                    Only the first {deviceData.size} entries are
                                    shown
                                </Alert>
                            )}
                    </>
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
                    (field) => (formatted[field] = data[field])
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
            <div className="w-100 d-flex justify-content-center my-6">
                <Spinner variant="primary" />
            </div>
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

    return (
        <Card className="my-5">
            <Card.Header>Time Series</Card.Header>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mx-5">
                    <div>
                        <Card.Title>
                            <div className="d-flex align-items-center gap-2">
                                Latest Value
                            </div>
                        </Card.Title>
                        <Card.Subtitle className="text-muted">
                            {latestData &&
                                formatTimestamp(latestData["timeStamp"], true)}
                        </Card.Subtitle>
                    </div>
                    <div className="d-flex flex-column gap-2 text-end">
                        <div>
                            <span className="font-monospace fs-5">
                                {displayNames[0]}
                            </span>
                            <Badge bg="secondary" className="ms-3 fs-6">
                                {(latestData && latestData[yAxisFields[0]]) +
                                    " " +
                                    units[0]}
                            </Badge>
                        </div>
                        <div>
                            <span className="font-monospace fs-5">
                                {displayNames[1]}
                            </span>
                            <Badge bg="secondary" className="ms-3 fs-6">
                                {(latestData && latestData[yAxisFields[1]]) +
                                    " " +
                                    units[1]}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="w-100 h-100 mt-2">
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={formattedData} margin={{ bottom: 80 }}>
                            <Line
                                yAxisId={0}
                                type="monotone"
                                dataKey={yAxisFields[0]}
                                stroke={generateHexColor(yAxisFields[0])}
                                strokeWidth={1.8}
                                unit={" " + units[0]}
                                legendType="plainline"
                                name={displayNames[0]}
                            />
                            <Line
                                yAxisId={1}
                                type="monotone"
                                dataKey={yAxisFields[1]}
                                stroke={generateHexColor(yAxisFields[1])}
                                strokeWidth={1.8}
                                unit={" " + units[1]}
                                legendType="plainline"
                                name={displayNames[1]}
                            />

                            <CartesianGrid
                                stroke="#ccc"
                                strokeDasharray="5 5"
                            />
                            <XAxis
                                dataKey="timeStamp"
                                angle={-10}
                                interval={0}
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
                                labelFormatter={(value) =>
                                    formatTimestamp(value, true)
                                }
                            />
                            <Legend verticalAlign="top" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-100 d-flex justify-content-center my-3">
                    <ButtonGroup>
                        <Button
                            variant="primary"
                            onClick={() => setScale(ALL_TIME_DAYS)}
                            active={scaleInDays === ALL_TIME_DAYS}>
                            All time
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setScale(ONE_YEAR)}
                            active={scaleInDays === ONE_YEAR}>
                            1 year
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setScale(SIX_MONTHS)}
                            active={scaleInDays === SIX_MONTHS}>
                            6 months
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setScale(ONE_MONTH)}
                            active={scaleInDays === ONE_MONTH}>
                            1 month
                        </Button>
                        <Button
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
                    <small>ID {data.id}</small>
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

function generateHexColor(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (var i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
}
