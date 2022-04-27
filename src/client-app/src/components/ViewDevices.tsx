import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";
import { range, sortAlphabetically, timeSince } from "../utils/utils";

export default function ViewDevices() {
  const [currentDevices, setCurrentDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      setCurrentDevices(await DeviceService.getAllDevices());
      setIsLoading(false);
    }
    fetchDevices();
  }, []);

  return (
    <>
      <div className="mb-5">
        <h2 className="d-inline">Registered Devices</h2>
        {isLoading && <Spinner animation="border" className="mx-3" />}
      </div>
      <ListGroup>
        {isLoading &&
          range(0, 10).map((index) => <DevicePlaceholder key={index} />)}
        {sortAlphabetically(currentDevices, "name").map((device) => (
          <DeviceItem key={device.id} device={device} />
        ))}
        {currentDevices.length < 1 && !isLoading && (
          <Alert variant="warning">
            No registered devices could be found — Register a new device{" "}
            <Alert.Link as="span">
              <Link to="/registerDevice" className="text-reset hover-underline">
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
}

const DeviceItem = ({ device }: DeviceCardProps) => {
  return (
    <ListGroup.Item action>
      <Link
        to={`/viewDevices/${device.id}`}
        state={{ device }}
        title={device.description}
      >
        <span className="d-flex justify-content-between p-2">
          <span>
            <span className="hover-underline">{device.name}</span>
            <small className="text-decoration-none text-muted pe-none mx-3">
              <em>Modified {timeSince(device.updatedAt || new Date())} ago</em>
            </small>
          </span>
          <Badge pill bg={device.enabled ? "success" : "secondary"}>
            {device.enabled ? "Enabled" : "Disabled"}
          </Badge>
          <Badge
            bg="danger"
            onClick={() => DeviceService.deleteDevice(device.id!)}
          >
            Delete
          </Badge>
        </span>
      </Link>
    </ListGroup.Item>
  );
};

const DevicePlaceholder = () => {
  const maxWidthPx = 350;
  const minWidthPx = 250;
  return (
    <ListGroup.Item>
      <Placeholder animation="glow">
        <span className="d-flex justify-content-between p-2">
          <Placeholder
            size="lg"
            style={{
              width: `${
                Math.random() * (maxWidthPx - minWidthPx + 1) + minWidthPx
              }px`,
            }}
          />
          <Placeholder
            size="lg"
            style={{
              width: "70px",
            }}
          />
        </span>
      </Placeholder>
    </ListGroup.Item>
  );
};
