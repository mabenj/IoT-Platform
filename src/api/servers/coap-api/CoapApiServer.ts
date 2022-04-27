import coap = require("coap");
import Config from "../../configs/coap-api.config";
import DeviceDataService from "../../services/device-data.service";
import DeviceService from "../../services/device.service";
import { sleep } from "../../utils/utils";
import Logger from "./logger";

class CoapApiServer {
	private isProd;
	private coapServer;

	constructor(isProd: boolean) {
		this.isProd = isProd;
		this.coapServer = coap.createServer();
	}

	public listen(port: number | string, callback?: () => void) {
		this.coapServer.on("request", this.handleRequest.bind(this));
		this.coapServer.listen(
			typeof port === "string" ? parseInt(port) : port,
			callback
		);
	}

	private async handleRequest(
		req: coap.IncomingMessage,
		res: coap.OutgoingMessage
	) {
		!this.isProd && (await sleep(Config.incomingRequestDelayMs));
		try {
			Logger.info(`${req.method} ${req.url}`);
			switch (req.method) {
				case "POST": {
					this.handlePost(req, res);
					break;
				}
				case "GET":
				case "PUT":
				case "DELETE":
				case null: {
					res.end(`Method '${req.method}' is not supported`);
					break;
				}
				default:
					res.end(`No valid method specified`);
					break;
			}
		} catch (err) {
			res.end(err);
		}
	}

	private async handlePost(
		req: coap.IncomingMessage,
		res: coap.OutgoingMessage
	) {
		const accessToken = req.url.split("/")[1];
		if (!accessToken) {
			res.code = "400";
			res.end("No access token specified");
			return;
		}
		const payload = JSON.parse(req.payload.toString());
		if (!payload) {
			res.code = "400";
			res.end("No payload specified");
			return;
		}
		const deviceId = await DeviceService.getDeviceId(accessToken, "coap", true);
		if (!deviceId) {
			res.code = "400";
			res.end(`Could not resolve access token '${accessToken}'`);
			return;
		}

		await DeviceDataService.addDeviceData(deviceId, payload);
		res.code = "201";
		res.end();
	}
}

export default CoapApiServer;
