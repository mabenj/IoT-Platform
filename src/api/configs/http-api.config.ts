import "dotenv/config";

interface HttpApiConfig {
    incomingRequestDelayMs: number;
    port: string | number;
}

const config: HttpApiConfig = {
    incomingRequestDelayMs: 1500,
    port: process.env.HTTP_PORT || process.env.PORT || 7100
};

export default config;
