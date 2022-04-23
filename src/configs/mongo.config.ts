import { ConnectOptions } from "mongoose";

const MONGO_OPTIONS: ConnectOptions = {
	socketTimeoutMS: 30000
};
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_HOST = process.env.MONGO_HOST || "";

const MongoConfig = {
	host: MONGO_HOST,
	username: MONGO_USERNAME,
	password: MONGO_PASSWORD,
	options: MONGO_OPTIONS,
	url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

export default MongoConfig;
