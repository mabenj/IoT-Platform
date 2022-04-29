import { NextFunction, Request, Response } from "express";
import Log from "../logger";

function loggerMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    request.path.startsWith("/api") &&
        Log.info(`${request.method} ${request.path}`);
    next();
}

export default loggerMiddleware;
