import { Request, Response } from "express";
import DeviceDataService from "../../../services/device-data.service";
import { getErrorMessage } from "../../../utils/utils";

async function getDeviceData(
    req: Request<
        { deviceId: string },
        {},
        {},
        { page?: string }
    >,
    res: Response
) {
    const page = req.query.page ? +req.query.page : 1;
    try {
        res.json(await DeviceDataService.getDeviceData(req.params.deviceId, page))
    } catch (error) {
        res.status(500).send(getErrorMessage(error));
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

async function getDeviceTimeSeries(
    req: Request<
        { deviceId: string },
        {},
        {},
        { start?: string; end?: string }
    >,
    res: Response
) {
    if (!req.query.start || !req.query.end) {
        res.status(400).send("Missing params");
        return;
    }
    res.json(
        await DeviceDataService.getTimeSeries(
            req.params.deviceId,
            new Date(+req.query.start),
            new Date(+req.query.end)
        )
    );
}

export default {
    getDeviceData,
    deleteDeviceData,
    exportDeviceDataJson,
    getDeviceTimeSeries
};
