import coap = require("coap");
import axios from "axios";
import {
    generateRandomCarData,
    generateRandomData,
    generateRandomWaterData,
    generateRandomWeatherData,
    sleep
} from "../utils/utils";
import Logger from "./logger";

async function main(args: string[]) {
    if (args.length < 7) {
        console.log("USAGE:");
        console.log(
            "  demo-device (<http> | <coap>) <host> <port> <access_token> (<car> | <water> | <weather> | <words>) <count> <interval_in_ms>"
        );
        console.log(
            "  Example: http localhost 7100 3U9L5gA57U weather 15 5000"
        );
        return;
    }
    const [protocol, host, port, accessToken, dataType, count, intervalMs] =
        args;
    const config = {
        protocol,
        host,
        port,
        accessToken,
        dataType,
        count: Number(count),
        intervalMs: Number(intervalMs)
    };
    Logger.info(`Generating random device data of type '${config.dataType}'`);
    let deviceData: any[];
    switch (dataType.toLowerCase()) {
        case "car": {
            deviceData = generateRandomCarData(config.count);
            break;
        }
        case "water": {
            deviceData = generateRandomWaterData(config.count);
            break;
        }
        case "weather": {
            deviceData = generateRandomWeatherData(config.count);
            break;
        }
        case "words": {
            deviceData = generateRandomData(config.count);
            break;
        }
        default: {
            deviceData = generateRandomData(config.count);
            break;
        }
    }
    switch (protocol.toLocaleLowerCase()) {
        case "http": {
            sendHttpData(deviceData, config);
            break;
        }
        case "coap": {
            await sendCoapData(deviceData, config);
            break;
        }
        default: {
            await sendHttpData(deviceData, config);
            break;
        }
    }
}

async function sendCoapData(data: any[], config: any) {
    for (let i = 0; i < config.count; i++) {
        const req = coap.request({
            hostname: config.host,
            port: config.port,
            method: "POST",
            pathname: `/${config.accessToken}`
        });
        req.write(JSON.stringify(data[i]));
        req.on("response", (res: coap.IncomingMessage) => {
            Logger.info(`RESPONSE: [${res.code}] ${res.payload.toString()}`);
        });
        req.end();
        await sleep(config.intervalMs);
    }
}

async function sendHttpData(data: any[], config: any) {
    for (let i = 0; i < config.count; i++) {
        axios
            .post(
                `http://${config.host}:${config.port}/${config.accessToken}`,
                data[i]
            )
            .then((response) => Logger.info(`RESPONSE: [${response.status}]`))
            .catch((error) =>
                Logger.error(
                    `RESPONSE: [${error.response.status}] ${error.response.data}`
                )
            );
        await sleep(config.intervalMs);
    }
}

if (require.main === module) {
    main(process.argv.slice(2));
}
