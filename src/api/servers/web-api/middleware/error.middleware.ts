import { NextFunction, Request, Response } from "express";
import Logger from "../logger";

function errorMiddleware(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (error.message === "Not found") {
        response.status(404);
    } else {
        response.status(500);
    }
    response.send({ message: error.message || "Something went wrong" });
    Logger.error(error.message || "Something went wrong");
    next();
}

export default errorMiddleware;
