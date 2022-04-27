import winston, { format, transports } from "winston";

const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";

const appLogger = winston.createLogger({
    transports: [generateConsoleTransport("MAIN-APP")]
});

const webApiLogger = winston.createLogger({
    transports: [generateConsoleTransport("WEB-API")]
});

const httpApiLogger = winston.createLogger({
    transports: [generateConsoleTransport("HTTP-API")]
});

const coapApiLogger = winston.createLogger({
    transports: [generateConsoleTransport("COAP-API")]
});

const demoDeviceLogger = winston.createLogger({
    transports: [generateConsoleTransport("DEMO-DEVICE")]
});

function generateConsoleTransport(label: string) {
    return new transports.Console({
        format: format.combine(
            format.colorize(),
            format.label({ label: `[${label}]` }),
            format.timestamp({ format: TIMESTAMP_FORMAT }),
            format.printf(
                (info) =>
                    `${info.timestamp}  ${info.level}  ${info.label} : ${info.message}`
            )
        )
    });
}

export default {
    app: appLogger,
    webApi: webApiLogger,
    httpApi: httpApiLogger,
    coapApi: coapApiLogger,
    demoDeviceLogger
};
