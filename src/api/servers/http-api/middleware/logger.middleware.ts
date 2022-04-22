import { Request, Response, NextFunction } from "express";
import Log from "../logger";

function loggerMiddleware(
	request: Request,
	response: Response,
	next: NextFunction
) {
	Log.info(`${request.method} ${request.path}`);
	next();
}

export default loggerMiddleware;
