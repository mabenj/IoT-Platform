import { Request, Response, NextFunction } from "express";
import Config from "../../../configs/web-api.config";
import { sleep } from "../../../utils/utils";

async function delayMiddleware(
	request: Request,
	response: Response,
	next: NextFunction
) {
	await sleep(Config.incomingRequestDelayMs);
	next();
}

export default delayMiddleware;
