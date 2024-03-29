import { differenceInDays, format, subMinutes } from "date-fns";
import { subDays } from "date-fns/esm";
import { useCallback, useEffect, useState } from "react";
import { Badge, ButtonGroup, Modal, Placeholder } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
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
import { useIsMobile } from "../hooks/useIsMobile";
import DeviceDataService from "../services/DeviceDataService";
import { timeAgo } from "../utils/utils";
import HoverTooltip from "./ui/HoverTooltip";

const ZOOM_LEVELS = {
    allTime: -1,
    oneYear: 365,
    oneMonth: 30,
    sixMonths: 6 * 30,
    oneWeek: 7,
    oneDay: 1
};

const LINE_COLOR_PALETTE = [
    "#ea5545",
    "#f46a9b",
    "#ef9b20",
    "#edbf33",
    "#ede15b",
    "#bdcf32",
    "#87bc45",
    "#27aeef",
    "#b33dc6"
];

interface TimeSeriesGraphProps {
    deviceId: string;
}

export default function TimeSeriesGraph({ deviceId }: TimeSeriesGraphProps) {
    const [showAsModal, setShowAsModal] = useState(false);
    const isMobile = useIsMobile();
    const [units, setUnits] = useState<string[]>([]);
    const [displayNames, setDisplayNames] = useState<string[]>([]);
    const [timestamps, setTimestamps] = useState<number[]>([]);
    const [timeSeriesValues, setTimeSeriesValues] = useState<unknown[][]>([]);
    const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.oneWeek);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const fetchTimeSeries = useCallback(
        async (daysToTake: number) => {
            if (!deviceId) {
                return;
            }
            const now = new Date();
            const startDate =
                daysToTake === -1 ? new Date(0) : subDays(now, daysToTake);
            setIsFetchingData(true);
            const timeSeries = await DeviceDataService.getDeviceTimeSeries(
                deviceId,
                startDate,
                now
            );
            setIsFetchingData(false);
            setUnits(timeSeries.units);
            setDisplayNames(timeSeries.displayNames);
            setTimestamps(timeSeries.timestamps);
            setTimeSeriesValues(timeSeries.timeSeriesValues);
        },
        [deviceId]
    );

    useEffect(() => {
        fetchTimeSeries(zoomLevel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatTimestamp = (timestampMillis: number, longFormat?: boolean) => {
        if (
            Math.abs(timestampMillis) === Number.POSITIVE_INFINITY ||
            isNaN(timestampMillis)
        ) {
            return "unknown";
        }
        if (typeof timestampMillis !== "number") {
            return format(new Date(), "yyyy-MM-dd HH:mm");
        }
        if (longFormat) {
            return format(new Date(timestampMillis), "yyyy-MM-dd HH:mm");
        }

        const oldestTimestamp = timestamps[0];
        const intervalDays = differenceInDays(
            subMinutes(new Date(), 5),
            new Date(oldestTimestamp)
        );

        if (intervalDays <= ZOOM_LEVELS.oneDay) {
            return format(new Date(timestampMillis), "HH:mm");
        }
        if (intervalDays <= ZOOM_LEVELS.oneWeek) {
            return format(new Date(timestampMillis), "yyyy-MM-dd HH:mm");
        }
        if (intervalDays <= ZOOM_LEVELS.oneMonth) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        if (intervalDays <= ZOOM_LEVELS.sixMonths) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        if (intervalDays <= ZOOM_LEVELS.oneYear) {
            return format(new Date(timestampMillis), "yyyy-MM-dd");
        }
        return format(new Date(timestampMillis), "yyyy-MM-dd");
    };

    const changeZoomLevel = (levelInDays: number) => {
        setZoomLevel(levelInDays);
        fetchTimeSeries(levelInDays);
    };

    if (isFetchingData) {
        return (
            <div className="w-100 d-flex align-items-center gap-3 my-6 mt-5">
                <Spinner size="sm" /> Loading time series data...
            </div>
        );
    }

    if (timeSeriesValues.length === 0) {
        return (
            <Alert variant="warning" className="my-5">
                No time series data available for this time frame
            </Alert>
        );
    }

    const CustomTick = (props: any) => {
        const { x, y, payload } = props;

        const angle = showAsModal ? -45 : -20;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform={`rotate(${angle})`}>
                    {formatTimestamp(payload.value)}
                </text>
            </g>
        );
    };

    const Chart = () => {
        const getYLabel = (axisIndex: number, right?: boolean) =>
            showAsModal
                ? {
                      value: units[axisIndex]
                          ? units[axisIndex]
                          : displayNames[axisIndex],
                      position: "top",
                      offset: 15
                  }
                : {
                      value: `${displayNames[axisIndex]} ${
                          units[axisIndex] && `(${units[axisIndex]})`
                      }`,
                      angle: -90,
                      position: right ? "right" : "insideLeft",
                      offset: right ? -15 : 15
                  };

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={timestamps.map((ts, i) => ({
                        timestamp: ts,
                        value0: timeSeriesValues[0][i],
                        value1: timeSeriesValues[1][i]
                    }))}
                    margin={{ bottom: 80, top: 30 }}>
                    <Line
                        yAxisId="line0"
                        unit={units[0] ? " " + units[0] : undefined}
                        name={displayNames[0]}
                        dataKey="value0"
                        type="linear"
                        stroke={pickElement(
                            LINE_COLOR_PALETTE,
                            displayNames[0]
                        )}
                        strokeWidth={1.8}
                        legendType="plainline"
                        dot={false}
                    />
                    <Line
                        yAxisId="line1"
                        unit={units[1] ? " " + units[1] : undefined}
                        name={displayNames[1]}
                        dataKey="value1"
                        type="linear"
                        stroke={pickElement(
                            LINE_COLOR_PALETTE,
                            displayNames[1]
                        )}
                        strokeWidth={1.8}
                        legendType="plainline"
                        dot={false}
                    />
                    <YAxis
                        yAxisId="line0"
                        width={showAsModal ? 30 : 60}
                        label={getYLabel(0)}
                    />
                    <YAxis
                        yAxisId="line1"
                        width={showAsModal ? 30 : 60}
                        label={getYLabel(1, true)}
                        orientation="right"
                    />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(val) => formatTimestamp(val)}
                        tick={<CustomTick />}
                        tickCount={80}
                        domain={["dataMin", "dataMax"]}
                        type="number"
                    />

                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Tooltip
                        labelFormatter={(value) => formatTimestamp(value, true)}
                    />
                    <Legend verticalAlign="top" />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const ZoomLevelButtons = () => (
        <div className="w-100 d-flex justify-content-center my-3">
            <HoverTooltip tooltip="Scale of data">
                <ButtonGroup>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.allTime)}
                        active={zoomLevel === ZOOM_LEVELS.allTime}>
                        All time
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.oneYear)}
                        active={zoomLevel === ZOOM_LEVELS.oneYear}>
                        1 year
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.sixMonths)}
                        active={zoomLevel === ZOOM_LEVELS.sixMonths}>
                        6 months
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.oneMonth)}
                        active={zoomLevel === ZOOM_LEVELS.oneMonth}>
                        1 month
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.oneWeek)}
                        active={zoomLevel === ZOOM_LEVELS.oneWeek}>
                        1 week
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => changeZoomLevel(ZOOM_LEVELS.oneDay)}
                        active={zoomLevel === ZOOM_LEVELS.oneDay}>
                        24 hours
                    </Button>
                </ButtonGroup>
            </HoverTooltip>
        </div>
    );

    const LatestValue = ({
        timestamp,
        values
    }: {
        timestamp: number;
        values: unknown[];
    }) => {
        const [timestampAgo, setTimestampAgo] = useState("");

        useEffect(() => {
            const interval = setInterval(() => {
                setTimestampAgo(timeAgo(new Date(timestamp)) || "");
            }, 1000);
            return () => clearInterval(interval);
        }, [timestamp]);

        return (
            <div className="iot-time-series-latest-value">
                <Card.Title>
                    <div className="iot-time-series-title">Latest Value</div>
                </Card.Title>
                <Card.Subtitle className="iot-time-series-timestamp">
                    <div className="text-muted text-center mb-2">
                        {timestampAgo || <Placeholder xs={5} />}
                    </div>
                    <HoverTooltip tooltip="Timestamp">
                        <span className="font-monospace">
                            {timestamp ? (
                                formatTimestamp(timestamp, true)
                            ) : (
                                <Placeholder xs={9} />
                            )}
                        </span>
                    </HoverTooltip>
                </Card.Subtitle>
                {values.map((value, i) => (
                    <div key={i} className={`iot-time-series-value${i + 1}`}>
                        <HoverTooltip tooltip={`Data field ${i + 1}`}>
                            <span className="font-monospace">
                                {displayNames[i]}
                            </span>
                        </HoverTooltip>
                        <HoverTooltip tooltip={`Value of data field ${i + 1}`}>
                            <Badge bg="secondary" className="ms-3 fs-6">
                                <>
                                    {value}
                                    {value && units[i] ? " " + units[i] : null}
                                </>
                            </Badge>
                        </HoverTooltip>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Card className="my-5">
            <Card.Header>Time Series</Card.Header>
            <Card.Body className="d-flex flex-column align-items-center">
                <LatestValue
                    timestamp={timestamps[timestamps.length - 1]}
                    values={timeSeriesValues.map(
                        (tsValues) => tsValues[tsValues.length - 1]
                    )}
                />
                <div className="w-100 h-100 mt-2 d-flex justify-content-center">
                    {isMobile ? (
                        <Button onClick={() => setShowAsModal(true)}>
                            <span className="mdi mdi-launch"></span> Show graph
                        </Button>
                    ) : (
                        <div style={{ height: "500px", width: "100%" }}>
                            <Chart />
                        </div>
                    )}
                    <Modal
                        show={showAsModal}
                        fullscreen="md-down"
                        onHide={() => setShowAsModal(false)}>
                        <Modal.Header closeButton>
                            Time Series Graph
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex flex-column h-100">
                                <Chart />
                                <ZoomLevelButtons />
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
                {!isMobile && <ZoomLevelButtons />}
            </Card.Body>
        </Card>
    );
}

function pickElement<T>(arr: T[], input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }

    const index = hash % arr.length;
    return arr[index];
}
