import { customAlphabet } from "nanoid";
import React, { FormEvent, useEffect, useRef, useState } from "react";
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
            <Form.Group className="mb-4" controlId="deviceDescription">
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
                            device to IoT-Platform
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
            <Row>
                <LabelCol></LabelCol>
                <ValueCol>
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
                                onClick={() => handleCancel()}
                                className="mx-3">
                                <span className="mdi mdi-close"></span> Cancel
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

function populateDeviceForm(
    initialDevice: Device,
    form: HTMLFormElement | null
) {
    if (!form) {
        return;
    }
    const {
        deviceEnabled,
        deviceName,
        deviceDescription,
        deviceProtocol,
        deviceAccessToken
    } = form.elements as any;
    deviceEnabled.checked = initialDevice.enabled;
    deviceName.value = initialDevice.name;
    deviceDescription.value = initialDevice.description;
    deviceProtocol.value = initialDevice.protocol;
    deviceAccessToken.value = initialDevice.accessToken;
}

function extractDevice(form: HTMLFormElement) {
    const {
        deviceEnabled,
        deviceName,
        deviceDescription,
        deviceProtocol,
        deviceAccessToken
    } = form.elements as any;
    const device: Device = {
        name: deviceName.value,
        accessToken: deviceAccessToken.value,
        description: deviceDescription.value,
        enabled: deviceEnabled.checked,
        protocol: deviceProtocol.value,
        timeSeriesConfigurations: []
    };
    return device;
}
