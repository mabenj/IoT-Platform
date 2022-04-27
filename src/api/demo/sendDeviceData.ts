import coap = require("coap");
import axios from "axios";
import CoapApiConfig from "../configs/coap-api.config";
import DemoConfig from "../configs/demo.config";
import HttpApiConfig from "../configs/http-api.config";
import connect from "../db/connect";
import {
	generateRandomCarData,
	generateRandomData,
	generateRandomWaterData,
	generateRandomWeatherData,
	sleep
} from "../utils/utils";

async function main() {
	await connect();
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
		await sleep(DemoConfig.intervalMs);
		const req = coap.request({
			host: "localhost",
			port: Number(CoapApiConfig.port),
			method: "POST",
			pathname: `/${DemoConfig.accessToken}`
		});
		req.write(JSON.stringify(data[i]));
		req.on("response", (res: coap.IncomingMessage) => {
			console.log(`RESPONSE: [${res.code}] ${res.payload.toString()}`);
			res.on("end", () => {
				process.exit(0);
			});
		});
		req.end();
	}
}

async function sendHttpData(data: any[]) {
	for (let i = 0; i < DemoConfig.count; i++) {
		await sleep(DemoConfig.intervalMs);
		axios
			.post(
				`http://localhost:${HttpApiConfig.port}/${DemoConfig.accessToken}`,
				data[i]
			)
			.then((response) => console.log(`RESPONSE: [${response.status}]`))
			.catch((error) =>
				console.error(
					`RESPONSE: [${error.response.status}] ${error.response.data}`
				)
			);
	}
}

if (require.main === module) {
	main();
}
