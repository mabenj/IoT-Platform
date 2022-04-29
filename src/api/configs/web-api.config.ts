import "dotenv/config";

interface WebApiConfig {
    incomingRequestDelayMs: number;
    port: number | string;
}

const config: WebApiConfig = {
    incomingRequestDelayMs: 0,
    port: process.env.WEB_PORT || process.env.PORT || 7000
};

export default config;
