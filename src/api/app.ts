import CoapApiConfig from "./configs/coap-api.config";
import HttpApiConfig from "./configs/http-api.config";
import WebApiConfig from "./configs/web-api.config";
import connect from "./db/connect";
import CoapApiServer from "./servers/coap-api/CoapApiServer";
import HttpApiServer from "./servers/http-api/HttpApiServer";
import WebApiServer from "./servers/web-api/WebApiServer";
import Log from "./utils/loggers";

const Logger = Log.app;

class App {
    private isProd = process.env.NODE_ENV?.trim() === "production";
    private useWebApi = true;
    private useHttpApi = true;
    private useCoapApi = true;

    constructor(args: string[]) {
        if (args.length > 0) {
            this.useWebApi = args.includes("web");
            this.useHttpApi = args.includes("http");
            this.useCoapApi = args.includes("coap");
        }
    }

    public async start() {
        await this.initializeDatabase();

        this.useWebApi &&
            new WebApiServer(this.isProd).listen(WebApiConfig.port, () => {
                Logger.info(``);
                Logger.info(`----------- Web API -------------`);
                Logger.info(
                    `Web API is listening on port ${WebApiConfig.port}`
                );
                Logger.info(`---------------------------------`);
                Logger.info(``);
            });

        this.useHttpApi &&
            new HttpApiServer(this.isProd).listen(HttpApiConfig.port, () => {
                Logger.info(``);
                Logger.info(`----------- HTTP API -------------`);
                Logger.info(
                    `HTTP API is listening on port ${HttpApiConfig.port}`
                );
                Logger.info(`----------------------------------`);
                Logger.info(``);
            });

        this.useCoapApi &&
            new CoapApiServer(this.isProd).listen(CoapApiConfig.port, () => {
                Logger.info(``);
                Logger.info(`----------- CoAP API -------------`);
                Logger.info(
                    `CoAP API is listening on port ${CoapApiConfig.port}`
                );
                Logger.info(`----------------------------------`);
                Logger.info(``);
            });
    }

    private async initializeDatabase() {
        Logger.info("Initializing database");
        await connect(
            () => Logger.info("Database connected"),
            (reason) => {
                Logger.error(
                    `Error happened while connecting to database: ${reason}`
                );
                process.exit(1);
            }
        );
    }
}

if (require.main === module) {
    new App(process.argv.slice(2)).start();
}
