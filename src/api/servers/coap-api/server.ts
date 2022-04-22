import Logger from "./logger";

class CoapApiServer {
	private isProd;

	constructor(isProd: boolean) {
		this.isProd = isProd;
	}

	public listen(port: number | string, callback?: () => void) {
		// TODO: docs: https://github.com/mcollina/node-coap
		Logger.warn("CoAP API is not implemented yet");
	}
}

export default CoapApiServer;
