import { Request, Response } from "express";
import DeviceDataService from "../../../services/device-data.service";
import { getDateString } from "../../../utils/utils";

async function getDeviceData(
    req: Request<
        { deviceId: string },
        {},
        {},
        { start?: number; stop?: number }
    >,
    res: Response
) {
    res.json(
        await DeviceDataService.getMostRecentDeviceData(
            req.params.deviceId,
            req.query.start,
            req.query.stop
        )
    );
}

async function exportDeviceDataJson(
    req: Request<{ deviceId: string }>,
    res: Response
) {
    const allDeviceData = await DeviceDataService.getAllDeviceData(
        req.params.deviceId
    );
    const json = JSON.stringify(allDeviceData);
    const filename = `Device_data_${req.params.deviceId}_${getDateString(
        new Date()
    )}.json`;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.send(json);
}

async function deleteDeviceData(
    req: Request<{ deviceId: string }>,
    res: Response
) {
    await DeviceDataService.removeDeviceData(req.params.deviceId);
    res.status(204).send();
}

export default {
    getDeviceData,
    deleteDeviceData,
    exportDeviceDataJson
};
