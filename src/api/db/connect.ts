import mongoose from "mongoose";
import MongoConfig from "../../configs/mongo.config";

export default async function (
	successFunction?: () => void,
	errorFunction?: (message: string) => void
) {
	try {
		await mongoose.connect(MongoConfig.url, MongoConfig.options);
		successFunction && successFunction();
	} catch (err) {
		errorFunction &&
			errorFunction(
				err instanceof Error
					? err.message
					: typeof err === "string"
					? err
					: "Unknown error"
			);
	}
}
