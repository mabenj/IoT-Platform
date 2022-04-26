import "dotenv/config";

interface CoapApiConfig {
	incomingRequestDelayMs: number;
	port: string | number;
}

const config: CoapApiConfig = {
	incomingRequestDelayMs: 1500,
	port: process.env.COAP_PORT || 7200
};

export default config;
