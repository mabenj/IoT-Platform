import express, { Request, Response } from "express";
import "express-async-errors";
import { DeviceData } from "../../../interfaces/device-data.interface";
import DeviceDataService from "../../services/device-data.service";
import DeviceService from "../../services/device.service";
import delayMiddleware from "./middleware/delay.middleware";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";

class HttpApiServer {
	private isProd;
	private app;

	constructor(isProd: boolean) {
		this.isProd = isProd;
		this.app = express();
		this.initializeMiddleware();
		this.initializeRoutes();
		this.app.use(errorMiddleware);
	}

	public listen(port: number | string, callback?: () => void) {
		this.app.listen(port, callback);
	}

	private initializeMiddleware() {
		this.app.use(express.json());
		!this.isProd && this.app.use(delayMiddleware);
		this.app.use(loggerMiddleware);
	}

	private initializeRoutes() {
		this.app.post("/:accessToken", this.handlePost);
	}

	private async handlePost(
		req: Request<{ accessToken: string }, {}, DeviceData>,
		res: Response
	) {
		const deviceId = await DeviceService.getDeviceId(
			req.params.accessToken,
			"http",
			true
		);
		if (!deviceId) {
			res
				.status(400)
				.send(`Could not resolve access token '${req.params.accessToken}'`);
			return;
		}
		await DeviceDataService.addDeviceData(deviceId, req.body);
		res.status(201).send();
	}
}

export default HttpApiServer;
