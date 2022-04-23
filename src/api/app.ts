import CoapApiConfig from "../configs/coap-api.config";
import HttpApiConfig from "../configs/http-api.config";
import WebApiConfig from "../configs/web-api.config";
import Log from "../utils/loggers";
import connect from "./db/connect";
import CoapApiServer from "./servers/coap-api/server";
import HttpApiServer from "./servers/http-api/server";
import WebApiServer from "./servers/web-api/server";

const Logger = Log.app;

class App {
	private isProd = process.env.NODE_ENV?.trim() === "production";

	constructor() {}

	public async start() {
		await this.initializeDatabase();
		new WebApiServer(this.isProd).listen(WebApiConfig.port, () => {
			Logger.info(``);
			Logger.info(`----------- Web API -------------`);
			Logger.info(`Web API is listening on port ${WebApiConfig.port}`);
			Logger.info(`---------------------------------`);
			Logger.info(``);
		});
		new HttpApiServer(this.isProd).listen(HttpApiConfig.port, () => {
			Logger.info(``);
			Logger.info(`----------- HTTP API -------------`);
			Logger.info(`HTTP API is listening on port ${HttpApiConfig.port}`);
			Logger.info(`----------------------------------`);
			Logger.info(``);
		});
		new CoapApiServer(this.isProd).listen(CoapApiConfig.port, () => {
			Logger.info(``);
			Logger.info(`----------- CoAP API -------------`);
			Logger.info(`CoAP API is listening on port ${CoapApiConfig.port}`);
			Logger.info(`----------------------------------`);
			Logger.info(``);
		});
	}

	private async initializeDatabase() {
		Logger.info("Connecting to database");
		await connect(
			() => Logger.info("Database connected"),
			(reason) => {
				Logger.error(`Error happened while connecting to database: ${reason}`);
				process.exit(1);
			}
		);
	}
}

if (require.main === module) {
	new App().start();
}