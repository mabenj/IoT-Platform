import { Request, Response } from "express";
import DeviceDataService from "../../../services/device-data.service";
import { getErrorMessage } from "../../../utils/utils";

async function getDeviceData(
    req: Request<
        { deviceId: string },
        {},
        {},
        { start?: number; stop?: number; startDate?: string; endDate?: string }
    >,
    res: Response
) {
    const { start, stop, startDate, endDate } = req.query;
    try {
        if (startDate && endDate) {
            res.json(
                await DeviceDataService.getBetween(
                    req.params.deviceId,
                    new Date(startDate),
                    new Date(endDate)
                )
            );
        } else if (start && stop) {
            res.json(
                await DeviceDataService.getMostRecentDeviceData(
                    req.params.deviceId,
                    req.query.start,
                    req.query.stop
                )
            );
        } else {
            throw new Error("Missing parameters");
        }
    } catch (error) {
        res.status(400).send(getErrorMessage(error));
    }
}

async function exportDeviceDataJson(
    req: Request<{ deviceId: string }>,
    res: Response
) {
    const { json, filename } = await DeviceDataService.exportToJson(
        req.params.deviceId
    );
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.send(json);
}

async function deleteDeviceData(
    req: Request<{ deviceId: string }>,
    res: Response
) {
    res.status(403).send("Not allowed");
    // await DeviceDataService.removeDeviceData(req.params.deviceId);
    // res.status(204).send();
}

export default {
    getDeviceData,
    deleteDeviceData,
    exportDeviceDataJson
};
