import coap = require("coap");
import axios from "axios";
import CoapApiConfig from "../configs/coap-api.config";
import DemoConfig from "../configs/demo.config";
import HttpApiConfig from "../configs/http-api.config";
import {
    generateRandomCarData,
    generateRandomData,
    generateRandomWaterData,
    generateRandomWeatherData,
    sleep
} from "../utils/utils";
import Logger from "./logger";

async function main() {
    Logger.info(
        `Generating random device data of type '${DemoConfig.deviceType}'`
    );
    let deviceData: any[];
    switch (DemoConfig.deviceType.toLowerCase()) {
        case "car": {
            deviceData = generateRandomCarData(DemoConfig.count);
            break;
        }
        case "water": {
            deviceData = generateRandomWaterData(DemoConfig.count);
            break;
        }
        case "weather": {
            deviceData = generateRandomWeatherData(DemoConfig.count);
            break;
        }
        case "words": {
            deviceData = generateRandomData(DemoConfig.count);
            break;
        }
        default: {
            deviceData = generateRandomData(DemoConfig.count);
            break;
        }
    }
    switch (DemoConfig.protocol) {
        case "http": {
            await sendHttpData(deviceData);
            break;
        }
        case "coap": {
            await sendCoapData(deviceData);
            break;
        }
        default: {
            await sendHttpData(deviceData);
            break;
        }
    }
    process.exit(0);
}

async function sendCoapData(data: any[]) {
    for (let i = 0; i < DemoConfig.count; i++) {
        const req = coap.request({
            host: "localhost",
            port: Number(CoapApiConfig.port),
            method: "POST",
            pathname: `/${DemoConfig.accessToken}`
        });
        req.write(JSON.stringify(data[i]));
        req.on("response", (res: coap.IncomingMessage) => {
            Logger.info(`RESPONSE: [${res.code}] ${res.payload.toString()}`);
            res.on("end", () => {
                process.exit(0);
            });
        });
        req.end();
        await sleep(DemoConfig.intervalMs);
    }
}

async function sendHttpData(data: any[]) {
    for (let i = 0; i < DemoConfig.count; i++) {
        axios
            .post(
                `http://localhost:${HttpApiConfig.port}/${DemoConfig.accessToken}`,
                data[i]
            )
            .then((response) => Logger.info(`RESPONSE: [${response.status}]`))
            .catch((error) =>
                Logger.error(
                    `RESPONSE: [${error.response.status}] ${error.response.data}`
                )
            );
        await sleep(DemoConfig.intervalMs);
    }
}

if (require.main === module) {
    main();
}
