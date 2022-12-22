import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Badge, ButtonGroup, Modal } from "react-bootstrap";
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
import { DeviceData } from "../../../interfaces/device-data.interface";
import { TimeSeriesConfiguration } from "../../../interfaces/time-series-configuration.interface";
import { useIsMobile } from "../hooks/useIsMobile";
import { generateHexColor, range, timeAgo } from "../utils/utils";
import HoverTooltip from "./ui/HoverTooltip";

const ALL_TIME_DAYS = Number.MAX_VALUE;
const ONE_YEAR = 365;
const ONE_MONTH = 30;
const SIX_MONTHS = 6 * ONE_MONTH;
const ONE_WEEK = 7;

interface TimeSeriesGraphProps {
    deviceData: DeviceData[];
    timeSeriesConfigs: TimeSeriesConfiguration[];
    loading: boolean;
    onDataRequested: (daysToTake: number) => any;
}

export default function TimeSeriesGraph({
    deviceData,
    timeSeriesConfigs,
    loading,
    onDataRequested
}: TimeSeriesGraphProps) {
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
        const units = timeSeriesConfigs.map((config) => config.unit);
        const displayNames = timeSeriesConfigs.map(
            (config) => config.displayName || config.valueField
        );
        setYAxisFields(yAxisFields);
        setUnits(units);
        setDisplayNames(displayNames);
    }, [timeSeriesConfigs]);

    useEffect(() => {
        const formattedData = deviceData.map(({ createdAt, data }) => {
            let formatted: Record<string, any> = {
                timeStamp: createdAt.getTime()
            };
            yAxisFields.forEach((field) => (formatted[field] = +data[field]));
            return formatted;
        });
        setFormattedData(formattedData);
    }, [deviceData, yAxisFields]);

    const setScale = (scaleInDays: number) => {
        setScaleInDays(scaleInDays);
        onDataRequested(scaleInDays);
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
            <div className="w-100 d-flex align-items-center gap-3 my-6 mt-5">
                <Spinner size="sm" /> Loading time series data...
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
            <HoverTooltip tooltip="Scale of data">
                <ButtonGroup vertical={isMobile}>
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
            </HoverTooltip>
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
                        <div className="text-muted text-center mb-2">
                            {latestData &&
                                timeAgo(new Date(latestData["timeStamp"]))}
                        </div>
                        <HoverTooltip tooltip="Timestamp">
                            <span className="font-monospace">
                                {latestData &&
                                    formatTimestamp(
                                        latestData["timeStamp"],
                                        true
                                    )}
                            </span>
                        </HoverTooltip>
                    </Card.Subtitle>
                    {range(0, 1).map((index) => (
                        <div
                            key={index}
                            className={`iot-time-series-value${index + 1}`}>
                            <HoverTooltip tooltip={`Data field ${index + 1}`}>
                                <span className="font-monospace">
                                    {displayNames[index]}
                                </span>
                            </HoverTooltip>
                            <HoverTooltip
                                tooltip={`Value of data field ${index + 1}`}>
                                <Badge bg="secondary" className="ms-3 fs-6">
                                    {latestData
                                        ? latestData[yAxisFields[index]]
                                        : null}
                                    {latestData && units[index]
                                        ? " " + units[index]
                                        : null}
                                </Badge>
                            </HoverTooltip>
                        </div>
                    ))}
                </div>
                <div className="w-100 h-100 mt-2 d-flex justify-content-center">
                    {isMobile ? (
                        <Button onClick={() => setShowAsModal(true)}>
                            <span className="mdi mdi-launch"></span> Show graph
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
}
