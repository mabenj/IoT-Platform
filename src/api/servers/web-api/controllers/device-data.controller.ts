import { Request, Response } from "express";
import DeviceDataService from "../../../services/device-data.service";

async function getDeviceData(
    req: Request<{ deviceId: string }, {}, {}, { start?: number; stop?: number }>,
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

async function deleteDeviceData(
    req: Request<{ deviceId: string }>,
    res: Response
) {
    await DeviceDataService.removeDeviceData(req.params.deviceId);
    res.status(204).send();
}

export default {
    getDeviceData,
    deleteDeviceData
};
