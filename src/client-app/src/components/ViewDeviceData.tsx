import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Pagination, Popover } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import ReactJson from "react-json-view";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { DeviceData } from "../../../interfaces/device-data.interface";
import { Device } from "../../../interfaces/device.interface";
import DeviceDataService from "../services/DeviceDataService";
import { range, timeAgo } from "../utils/utils";
import { DevicesContext } from "./App";
import TimeSeriesGraph from "./TimeSeriesGraph";
import HoverTooltip from "./ui/HoverTooltip";

export default function ViewDeviceData() {
    const [device, setDevice] = useState<Device>();
    const [isExporting, setIsExporting] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(currentPage);
    const [totalDeviceDataCount, setTotalDeviceDataCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    const { devices } = useContext(DevicesContext) || { devices: [] };
    const { deviceId } = useParams();

    const navigate = useNavigate();

    const fetchDeviceData = async (pageToFetch: number) => {
        if (!deviceId) {
            setDeviceData([]);
            return;
        }

        setIsFetchingData(true);
        const { pagination, items } = await DeviceDataService.getDeviceData(
            deviceId,
            pageToFetch
        );
        const {
            // currentCount,
            totalCount,
            currentPage,
            totalPages,
            itemsPerPage
        } = pagination;
        setDeviceData(items);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setTotalDeviceDataCount(totalCount);
        setItemsPerPage(itemsPerPage);
        setIsFetchingData(false);
    };

    useEffect(() => {
        const currentDevice = devices.find(({ id }) => id === deviceId);
        if (currentDevice) {
            setDevice(currentDevice);
            fetchDeviceData(currentPage);
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
            setDeviceData([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalDeviceDataCount(0);
            setItemsPerPage(1);
        });
    };

    const refresh = () => {
        navigate(0);
    };

    const goToPage = (page: number) => {
        fetchDeviceData(page);
    };

    const PaginatedList = () => {
        const pageButtonsToDisplay = 10;

        const padding = Math.floor(pageButtonsToDisplay / 2);
        let startIndex = Math.max(1, currentPage - padding);
        const endIndex = Math.min(
            totalPages,
            startIndex + pageButtonsToDisplay - 1
        );

        if (endIndex - padding < currentPage) {
            startIndex -= Math.abs(endIndex - padding - currentPage + 1);
            startIndex = startIndex <= 0 ? 1 : startIndex;
        }

        return (
            <div className="d-flex align-items-center gap-3">
                <Pagination>
                    <Pagination.Prev
                        disabled={currentPage <= 1}
                        onClick={() => goToPage(currentPage - 1)}
                    />

                    {startIndex > 1 && (
                        <>
                            <Pagination.First onClick={() => goToPage(1)}>
                                1
                            </Pagination.First>
                            <div className="mx-3 align-self-end">...</div>
                        </>
                    )}

                    {Array.from(
                        { length: endIndex - startIndex + 1 },
                        (_, i) => i + startIndex
                    ).map((pageNumber) => (
                        <Pagination.Item
                            key={pageNumber}
                            active={currentPage === pageNumber}
                            onClick={() => goToPage(pageNumber)}>
                            {pageNumber}
                        </Pagination.Item>
                    ))}

                    {endIndex < totalPages && (
                        <>
                            <div className="mx-3 align-self-end">...</div>
                            <Pagination.Last
                                onClick={() => goToPage(totalPages)}>
                                {totalPages}
                            </Pagination.Last>
                        </>
                    )}

                    <Pagination.Next
                        disabled={currentPage >= totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    />
                </Pagination>
                {isFetchingData && <Spinner size="sm" />}
            </div>
        );
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
                        <TimeSeriesGraph deviceId={device.id!} />
                    )}
                <div className="mt-4 d-flex gap-2">
                    <Button onClick={refresh} disabled={isExporting}>
                        <span className="mdi mdi-reload"></span> Refresh
                    </Button>
                    <HoverTooltip tooltip="Export all device data as JSON">
                        <Button
                            disabled={deviceData.length < 1 || isExporting}
                            onClick={exportData}>
                            {isExporting ? (
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                            ) : (
                                <span className="mdi mdi-cloud-download"></span>
                            )}{" "}
                            Export to JSON
                        </Button>
                    </HoverTooltip>
                    <OverlayTrigger
                        trigger="focus"
                        placement="top"
                        overlay={confirmDeletePopover}>
                        <Button disabled={deviceData.length < 1 || isExporting}>
                            <span className="mdi mdi-delete"></span> Delete All
                            Data
                        </Button>
                    </OverlayTrigger>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <small className="text-muted d-block">
                        Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                        {(currentPage - 1) * itemsPerPage + deviceData.length}{" "}
                        out of {totalDeviceDataCount} entries
                    </small>
                    {totalPages > 1 && <PaginatedList />}
                </div>
                {!isFetchingData &&
                    deviceData.map((data) => (
                        <DeviceDataCard key={data.id} data={data} />
                    ))}
                {isFetchingData &&
                    range(0, 10).map((index) => (
                        <React.Fragment key={index}>
                            <DeviceDataPlaceholder />
                            <br />
                        </React.Fragment>
                    ))}
                {device && !isFetchingData && deviceData.length === 0 && (
                    <Alert variant="warning" className="mt-5">
                        No device data exists for device '
                        <strong>{device.name}</strong>'
                    </Alert>
                )}

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center my-5">
                        <PaginatedList />
                    </div>
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
                {timeAgo(data.createdAt)}
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
