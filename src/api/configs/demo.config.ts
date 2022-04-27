import "dotenv/config";

interface DemoConfig {
	deviceType: "car" | "weather" | "water" | "words";
	protocol: "http" | "coap";
	accessToken: string;
	count: number;
	intervalMs: number;
}

const config: DemoConfig = {
	deviceType: "words",
	protocol: "http",
	accessToken: "",
	count: 15,
	intervalMs: 2000
};

export default config;
