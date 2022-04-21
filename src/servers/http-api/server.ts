import express, { Request, Response } from "express";
import "express-async-errors";
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
		this.app.post("/:accessToken", (req: Request, res: Response) => {
			// TODO
			res.status(501).send("Not implemented");
		});
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
}

export default HttpApiServer;
