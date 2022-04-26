import { customAlphabet } from "nanoid";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";

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
	const [validated, setValidated] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
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
		const form = formRef.current;
		setValidated(true);
		if (!form || !form.checkValidity()) {
			return;
		}
		setIsRegistering(true);
		const newDevice = { ...initialDevice, ...extractDevice(form) };
		await onSubmit(newDevice);
		setIsRegistering(false);
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
								Device Name <Asterisk />
							</span>
						</Form.Label>
					</LabelCol>
					<Col>
						<Form.Control
							type="text"
							placeholder="Enter a name"
							required
							disabled={isRegistering}
						/>
						<Form.Control.Feedback type="invalid">
							Provide a name
						</Form.Control.Feedback>
					</Col>
				</Row>
			</Form.Group>

			<Form.Group className="mb-4" controlId="deviceDescription">
				<Row>
					<LabelCol>
						<Form.Label>Description</Form.Label>
					</LabelCol>
					<Col>
						<Form.Control
							as="textarea"
							placeholder="Enter a description"
							disabled={isRegistering}
						/>
					</Col>
				</Row>
			</Form.Group>

			<Form.Group className="mb-4" controlId="deviceDescription">
				<Row>
					<LabelCol>
						<Form.Label>Enabled</Form.Label>
					</LabelCol>
					<Col>
						<Form.Check
							type="switch"
							id="deviceEnabled"
							label=""
							defaultChecked
							disabled={isRegistering}
						/>
					</Col>
				</Row>
			</Form.Group>

			<Form.Group className="mb-4">
				<Row>
					<LabelCol>
						<Form.Label>Protocol</Form.Label>
					</LabelCol>
					<Col>
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
							The protocol used by the device to send data to IoT-Platform
						</Form.Text>
					</Col>
				</Row>
			</Form.Group>

			<Form.Group className="mb-4" controlId="deviceAccessToken">
				<Row>
					<LabelCol>
						<Form.Label>
							Access Token <Asterisk />
						</Form.Label>
					</LabelCol>
					<Col>
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
								Provide a valid access token. It must be atleast 8 characters
								long and contain only letters and digits.
							</Form.Control.Feedback>
						</InputGroup>
						<Form.Text muted>
							Access token is used to link the real physical device to
							IoT-Platform
						</Form.Text>
					</Col>
				</Row>
			</Form.Group>

			<Row>
				<LabelCol></LabelCol>
				<Col>
					<Button variant="primary" type="submit" disabled={isRegistering}>
						{isRegistering ? (
							<Spinner animation="border" size="sm" />
						) : (
							<span className="mdi mdi-check"></span>
						)}{" "}
						{isCreatingNew ? "Register Device" : "Update Device"}
					</Button>
					<Button
						variant="secondary"
						type="reset"
						onClick={() => navigate("/")}
						className="mx-3">
						<span className="mdi mdi-close"></span> Cancel
					</Button>
				</Col>
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
			<span className="me-4">{children}</span>
		</Col>
	);
};

const Asterisk = () => {
	return (
		<strong className="text-primary" title="This is a required field">
			*
		</strong>
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
		protocol: deviceProtocol.value
	};
	return device;
}
