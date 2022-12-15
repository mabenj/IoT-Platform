import { customAlphabet } from "nanoid";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { ListGroup, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import { TimeSeriesConfiguration } from "../../../interfaces/time-series-configuration.interface";

const ACCESS_TOKEN_REGEX = "[a-zA-Z0-9]{8,}";
const ACCESS_TOKEN_ALPHABET =
    "0123456789abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const nanoid = customAlphabet(ACCESS_TOKEN_ALPHABET, 10);

const LABEL_COL_WIDTH_XXl = 2;
const LABEL_COL_WIDTH_XL = 3;
const LABEL_COL_WIDTH_LG = 4;

interface DeviceFormProps {
    onSubmit: (device: Device) => Promise<void>;
    isCreatingNew?: boolean;
    initialDevice?: Device;
}

export default function DeviceForm({
    initialDevice,
    isCreatingNew,
    onSubmit
}: DeviceFormProps) {
    const [isEditing, setIsEditing] = useState(!!isCreatingNew);
    const [isAccessTokenVisible, setIsAccessTokenVisible] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [hasTimeSeries, setHasTimeSeries] = useState(false);
    const [timeSeriesConfigs, setTimeSeriesConfigs] = useState<
        TimeSeriesConfiguration[]
    >([]);
    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!initialDevice) {
            return;
        }
        populateDeviceForm(initialDevice, formRef.current);
    }, [initialDevice]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isEditing) {
            // clicked 'Modify device'
            setIsEditing(true);
            return;
        }

        // clicked 'Register device' or 'Update device'

        // get the last in array

        const form = formRef.current;
        setValidated(true);
        if (!form || !form.checkValidity()) {
            return;
        }
        setIsRegistering(true);
        const newDevice = { ...initialDevice, ...extractDevice(form) };
        await onSubmit(newDevice);
        setIsRegistering(false);

        setIsEditing(false);
        setValidated(false);
    };

    const handleCancel = () => {
        if (isCreatingNew) {
            navigate("/");
            return;
        }
        setIsEditing(false);
    };

    const generateAccessToken = () => {
        const accessTokenInput = (formRef.current?.elements as any)
            .deviceAccessToken;

        if (accessTokenInput) {
            accessTokenInput.value = nanoid();
        }
    };

    const copyAccessToken = () => {
        const accessTokenInput = (formRef.current?.elements as any)
            .deviceAccessToken;
        navigator.clipboard.writeText(accessTokenInput?.value || "");
    };

    const getAccessTokenString = (accessToken: string) => {
        if (isAccessTokenVisible) {
            return accessToken;
        }
        let result = "";
        for (let i = 0; i < accessToken.length; i++) {
            result += "●";
        }
        return result;
    };

    const addTimeSeriesConfig = () => {
        setTimeSeriesConfigs([
            ...timeSeriesConfigs,
            {
                valueField: "",
                displayName: "",
                unit: ""
            }
        ]);
    };

    const removeTimeSeriesConfig = (index: number) => {
        setTimeSeriesConfigs((prev) => prev.filter((_, i) => i !== index));
    };

    const populateDeviceForm = (
        device: Device,
        form: HTMLFormElement | null
    ) => {
        if (!form) {
            return;
        }
        const {
            deviceEnabled,
            deviceName,
            deviceDescription,
            deviceProtocol,
            deviceAccessToken,
            deviceHasTimeSeries
        } = form.elements as any;
        deviceEnabled.checked = device.enabled;
        deviceName.value = device.name;
        deviceDescription.value = device.description;
        deviceProtocol.value = device.protocol;
        deviceAccessToken.value = device.accessToken;
        deviceHasTimeSeries.checked = device.hasTimeSeries;

        setHasTimeSeries(device.hasTimeSeries);
        setTimeSeriesConfigs(device.timeSeriesConfigurations);
    };

    const extractDevice = (form: HTMLFormElement) => {
        const {
            deviceEnabled,
            deviceName,
            deviceDescription,
            deviceProtocol,
            deviceAccessToken,
            deviceHasTimeSeries
        } = form.elements as any;
        const device: Device = {
            name: deviceName.value,
            accessToken: deviceAccessToken.value,
            description: deviceDescription.value,
            enabled: deviceEnabled.checked,
            protocol: deviceProtocol.value,
            hasTimeSeries: deviceHasTimeSeries.checked,
            timeSeriesConfigurations: timeSeriesConfigs
        };
        return device;
    };

    return (
        <Form
            ref={formRef}
            className="mt-5"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onReset={() => setValidated(false)}>
            <Form.Group className="mb-4" controlId="deviceName">
                <Row>
                    <LabelCol>
                        <Form.Label>
                            <span>
                                Device Name <Asterisk isEditing={isEditing} />
                            </span>
                        </Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <Form.Control
                            type="text"
                            placeholder="Enter a name"
                            required
                            disabled={isRegistering}
                        />
                        <Form.Control.Feedback type="invalid">
                            Provide a name
                        </Form.Control.Feedback>
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        <ValueField>{initialDevice?.name}</ValueField>
                    </ValueCol>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4" controlId="deviceDescription">
                <Row>
                    <LabelCol>
                        <Form.Label>Description</Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <Form.Control
                            as="textarea"
                            placeholder="Enter a description"
                            disabled={isRegistering}
                        />
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        <ValueField>
                            {initialDevice?.description || "-"}
                        </ValueField>
                    </ValueCol>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4" controlId="deviceEnabled">
                <Row>
                    <LabelCol>
                        <Form.Label>Enabled</Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <Form.Check
                            type="switch"
                            id="deviceEnabled"
                            label=""
                            defaultChecked
                            disabled={isRegistering}
                        />
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        <ValueField>
                            {initialDevice?.enabled ? "Yes" : "No"}
                        </ValueField>
                    </ValueCol>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4">
                <Row>
                    <LabelCol>
                        <Form.Label>Protocol</Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <div>
                            <Form.Check
                                inline
                                type="radio"
                                id="protocolHttp"
                                name="deviceProtocol"
                                label="HTTP"
                                defaultChecked
                                required
                                value="http"
                                disabled={isRegistering}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="protocolCoap"
                                name="deviceProtocol"
                                label="CoAP"
                                required
                                value="coap"
                                disabled={isRegistering}
                            />
                        </div>
                        <Form.Text muted>
                            The protocol used by the device to send data to
                            IoT-Platform
                        </Form.Text>
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        <ValueField>
                            {initialDevice?.protocol === "http"
                                ? "HTTP"
                                : "CoAP"}
                        </ValueField>
                    </ValueCol>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4" controlId="deviceAccessToken">
                <Row>
                    <LabelCol>
                        <Form.Label>
                            Access Token <Asterisk isEditing={isEditing} />
                        </Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Enter an access token"
                                required
                                pattern={ACCESS_TOKEN_REGEX}
                                disabled={isRegistering}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => generateAccessToken()}
                                title="Generate access token"
                                disabled={isRegistering}>
                                <span className="mdi mdi-refresh"></span>
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => copyAccessToken()}
                                title="Copy to clipboard"
                                disabled={isRegistering}>
                                <span className="mdi mdi-content-copy"></span>
                            </Button>
                            <Form.Control.Feedback type="invalid">
                                Provide a valid access token. It must be at
                                least 8 characters long and contain only letters
                                and digits.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text muted>
                            Access token is used to link the real physical
                            device to IoT-Platform. <br />
                            Example HTTP POST URL to send data to IoT Platform:{" "}
                            <code>
                                https://iot-platform.example.com/{"{"}
                                access_token_here{"}"}
                            </code>
                        </Form.Text>
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        <ValueField>
                            <span
                                className="d-inline-block"
                                style={{
                                    width: `${
                                        (initialDevice?.accessToken?.length ||
                                            0) * 12
                                    }px`
                                }}>
                                {getAccessTokenString(
                                    initialDevice?.accessToken || ""
                                )}
                            </span>
                            <Button
                                variant=""
                                onClick={() =>
                                    setIsAccessTokenVisible((prev) => !prev)
                                }
                                title={
                                    isAccessTokenVisible
                                        ? "Hide access token"
                                        : "Show access token"
                                }>
                                {isAccessTokenVisible ? (
                                    <span className="mdi mdi-eye-off"></span>
                                ) : (
                                    <span className="mdi mdi-eye"></span>
                                )}
                            </Button>
                            <Button
                                variant=""
                                onClick={() => copyAccessToken()}
                                title="Copy to clipboard"
                                disabled={isRegistering}>
                                <span className="mdi mdi-content-copy"></span>
                            </Button>
                        </ValueField>
                    </ValueCol>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4">
                <Row>
                    <LabelCol>
                        <Form.Label>Time Series</Form.Label>
                    </LabelCol>
                    <ValueCol hidden={!isEditing}>
                        <Form.Check
                            type="switch"
                            id="deviceHasTimeSeries"
                            label=""
                            disabled={isRegistering}
                            className="mb-2"
                            checked={hasTimeSeries}
                            onChange={() => setHasTimeSeries((prev) => !prev)}
                        />
                        {hasTimeSeries && (
                            <>
                                <Table size="sm" className="mb-3">
                                    <thead>
                                        <tr>
                                            <th>Value Field</th>
                                            <th>Display Name</th>
                                            <th>Unit</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSeriesConfigs.map(
                                            (config, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Value field"
                                                            required
                                                            disabled={
                                                                isRegistering
                                                            }
                                                            value={
                                                                config.valueField
                                                            }
                                                            onChange={(e) =>
                                                                setTimeSeriesConfigs(
                                                                    (prev) => {
                                                                        prev[
                                                                            index
                                                                        ].valueField =
                                                                            e.target.value;
                                                                        return [
                                                                            ...prev
                                                                        ];
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Display name (optional)"
                                                            disabled={
                                                                isRegistering
                                                            }
                                                            value={
                                                                config.displayName
                                                            }
                                                            onChange={(e) =>
                                                                setTimeSeriesConfigs(
                                                                    (prev) => {
                                                                        prev[
                                                                            index
                                                                        ].displayName =
                                                                            e.target.value;
                                                                        return [
                                                                            ...prev
                                                                        ];
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Unit (optional)"
                                                            disabled={
                                                                isRegistering
                                                            }
                                                            value={config.unit}
                                                            onChange={(e) =>
                                                                setTimeSeriesConfigs(
                                                                    (prev) => {
                                                                        prev[
                                                                            index
                                                                        ].unit =
                                                                            e.target.value;
                                                                        return [
                                                                            ...prev
                                                                        ];
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button
                                                            type="button"
                                                            variant="outline-danger"
                                                            size="sm"
                                                            title="Delete configuration"
                                                            onClick={() =>
                                                                removeTimeSeriesConfig(
                                                                    index
                                                                )
                                                            }>
                                                            <span className="mdi mdi-delete"></span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </Table>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="d-block mb-3"
                                    onClick={addTimeSeriesConfig}
                                    disabled={
                                        timeSeriesConfigs.length === 2 ||
                                        timeSeriesConfigs.some(
                                            (config) => !config.valueField
                                        )
                                    }>
                                    <span className="mdi mdi-plus"></span> Add
                                    Configuration
                                </Button>
                                <Form.Text muted>
                                    Define the time series data (max 2 fields)
                                </Form.Text>
                            </>
                        )}
                    </ValueCol>
                    <ValueCol hidden={isEditing}>
                        {!hasTimeSeries ? (
                            "Not defined"
                        ) : (
                            <ListGroup>
                                {timeSeriesConfigs.map((config, index) => (
                                    <ListGroup.Item key={index}>
                                        <span title="Value field">
                                            {config.valueField}
                                            {config.displayName && (
                                                <small title="Display name">
                                                    <span className="mx-2">
                                                        -
                                                    </span>
                                                    <em>
                                                        {config.displayName}
                                                    </em>
                                                </small>
                                            )}
                                            {config.unit && (
                                                <small title="Unit">
                                                    <span className="mx-2">
                                                        -
                                                    </span>
                                                    <em>{config.unit}</em>
                                                </small>
                                            )}
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ValueCol>
                </Row>
            </Form.Group>
            <Row>
                <LabelCol></LabelCol>
                <ValueCol>
                    <div className="d-flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isRegistering}>
                                    {isRegistering ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <span className="mdi mdi-check"></span>
                                    )}{" "}
                                    {isCreatingNew
                                        ? "Register Device"
                                        : "Update Device"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    type="reset"
                                    onClick={() => handleCancel()}>
                                    <span className="mdi mdi-close"></span>{" "}
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="primary" type="submit">
                                    Modify Device
                                </Button>
                                <Link
                                    to={`/viewDevices/${initialDevice?.id}/viewdata`}
                                    state={{ device: initialDevice }}>
                                    <Button className="mx-3">
                                        View Device Data
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </ValueCol>
            </Row>
        </Form>
    );
}

interface LabelColProps {
    children?: React.ReactNode;
}

const LabelCol = ({ children }: LabelColProps) => {
    return (
        <Col
            xxl={LABEL_COL_WIDTH_XXl}
            xl={LABEL_COL_WIDTH_XL}
            lg={LABEL_COL_WIDTH_LG}
            className="text-lg-end">
            <strong className="me-4">{children}</strong>
        </Col>
    );
};

interface ValueColProps {
    children?: React.ReactNode;
    hidden?: boolean;
}

const ValueCol = ({ children, hidden }: ValueColProps) => {
    return (
        <Col lg={6} hidden={hidden}>
            {children}
        </Col>
    );
};

interface ValueFieldProps {
    children?: React.ReactNode;
}

const ValueField = ({ children }: ValueFieldProps) => {
    return <span className="py-3">{children}</span>;
};

interface AsteriskProps {
    isEditing: boolean;
}

const Asterisk = ({ isEditing }: AsteriskProps) => {
    if (!isEditing) {
        return <></>;
    }
    return (
        <sup
            className="mdi mdi-asterisk text-primary"
            title="This is a required field"
            style={{ fontSize: "0.5rem" }}></sup>
    );
};
