import express from "express";
import "express-async-errors";
import path from "path";
import delayMiddleware from "./middleware/delay.middleware";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
import ApiRoutes from "./routes/api.route";

class WebApiServer {
	private isProd;
	private app;

	constructor(isProd: boolean) {
		this.isProd = isProd;
		this.app = express();
		this.initializeMiddleware();
		this.app.use("/api", ApiRoutes);
		this.app.use(errorMiddleware);

		if (this.isProd) {
			this.app.use(
				express.static(path.join(__dirname, "../../client-app/build"))
			);
			this.app.get("*", (req, res) => {
				res.sendFile(path.join(__dirname, "client/build", "index.html"));
			});
		}
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

export default WebApiServer;
