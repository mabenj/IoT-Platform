import { Request, Response } from "express";
import DeviceDataService from "../../../services/device-data.service";

async function getDeviceData(req: Request<{ id: string }>, res: Response) {
	res.json(await DeviceDataService.getDeviceData(req.params.id));
}

async function deleteDeviceData(req: Request, res: Response) {
	res.status(501).send("Not implemented");
}

export default {
	getDeviceData,
	deleteDeviceData
};