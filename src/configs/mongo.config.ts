import { ConnectOptions } from "mongoose";

const mongoOptions: ConnectOptions = {
	socketTimeoutMS: 30000
};
const mongoUsername = process.env.MONGO_USERNAME || "";
const mongoPassword = process.env.MONGO_PASSWORD || "";
const mongoHost = process.env.MONGO_HOST || "";

const MongoConfig = {
	host: mongoHost,
	username: mongoUsername,
	password: mongoPassword,
	options: mongoOptions,
	url: `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoHost}`
};

export default MongoConfig;
