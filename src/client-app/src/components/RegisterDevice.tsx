import { customAlphabet } from "nanoid";
import React, { FormEvent, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import DeviceService from "../services/DeviceService";

const ACCESS_TOKEN_ALPHABET =
	"0123456789abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXY";

const nanoid = customAlphabet(ACCESS_TOKEN_ALPHABET, 10);

export default function RegisterDevice() {
	const [validated, setValidated] = useState(false);
	const accessTokenInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;
		setValidated(true);
		if (!form.checkValidity()) {
			return;
		}
		const {
			deviceEnabled,
			deviceName,
			deviceDescription,
			deviceProtocol,
			deviceAccessToken
		} = form.elements as any;
		const newDevice = await DeviceService.registerDevice({
			name: deviceName.value,
			accessToken: deviceAccessToken.value,
			description: deviceDescription.value,
			enabled: deviceEnabled.checked,
			protocol: deviceProtocol.value
		});
		navigate(`/viewDevices/${newDevice.id}`, { state: { device: newDevice } });
	};

	const generateAccessToken = () => {
		if (accessTokenInputRef.current) {
			accessTokenInputRef.current.value = nanoid();
		}
	};

	const copyAccessToken = () => {
		const currentToken = accessTokenInputRef.current?.value || "";
		navigator.clipboard.writeText(currentToken);
	};

	return (
		<>
			<h2 className="mb-4">Register a New Device</h2>
			<Form
				noValidate
				validated={validated}
				onSubmit={handleSubmit}
				onReset={() => setValidated(false)}>
				<Form.Group className="mb-4" controlId="deviceName">
					<Form.Label>
						Device Name
						<Required />
					</Form.Label>
					<Form.Control type="text" placeholder="Enter a name" required />
					<Form.Control.Feedback type="invalid">
						Provide a name
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group className="mb-4" controlId="deviceDescription">
					<Form.Label>Description</Form.Label>
					<Form.Control as="textarea" placeholder="Enter a description" />
				</Form.Group>

				<Form.Group className="mb-4" controlId="deviceDescription">
					<Form.Label>Enabled</Form.Label>
					<Form.Check
						className="mb-4"
						type="switch"
						id="deviceEnabled"
						label=""
						defaultChecked
					/>
				</Form.Group>

				<Form.Group className="mb-4">
					<Form.Label>Protocol</Form.Label>
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
						/>
						<Form.Check
							inline
							type="radio"
							id="protocolCoap"
							name="deviceProtocol"
							label="CoAP"
							required
							value="coap"
						/>
					</div>
					<Form.Text muted>
						The protocol used by the device to send data to IoT-Platform
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-4" controlId="deviceAccessToken">
					<Form.Label>
						Access Token
						<Required />
					</Form.Label>
					<InputGroup>
						<Form.Control
							ref={accessTokenInputRef}
							type="text"
							placeholder="Enter an access token"
							required
							pattern="[a-zA-Z0-9]{8,}"
						/>
						<Button
							variant="outline-secondary"
							onClick={() => generateAccessToken()}
							title="Generate access token">
							<span className="mdi mdi-refresh"></span>
						</Button>
						<Button
							variant="outline-secondary"
							onClick={() => copyAccessToken()}
							title="Copy to clipboard">
							<span className="mdi mdi-content-copy"></span>
						</Button>
						<Form.Control.Feedback type="invalid">
							Provide a valid access token. It must be atleast 8 characters long
							and contain only letters and digits.
						</Form.Control.Feedback>
					</InputGroup>
					<Form.Text muted>
						Access token is used to link the real physical device to
						IoT-Platform
					</Form.Text>
				</Form.Group>

				<Button variant="primary" type="submit">
					<span className="mdi mdi-login-variant"></span> Register Device
				</Button>
				<Button
					variant="secondary"
					type="reset"
					onClick={() => navigate("/")}
					className="mx-3">
					<span className="mdi mdi-close"></span> Cancel
				</Button>
			</Form>
		</>
	);
}

const Required = () => {
	return (
		<small className="text-muted">
			<span className="mx-3">|</span>Required
		</small>
	);
};
