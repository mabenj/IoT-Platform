import { Request, Response } from "express";
import { Device } from "../../../../interfaces/device.interface";
import DeviceService from "../../../services/device.service";
import Log from "../logger";

async function getDevices(req: Request, res: Response) {
	res.json(await DeviceService.getAllDevices());
}

async function getDevice(req: Request<{ id: string }>, res: Response) {
	res.json(await DeviceService.getDevice(req.params.id));
}

async function postDevice(req: Request<{}, {}, Device>, res: Response) {
	try {
		const newDevice = await DeviceService.addDevice(req.body);
		res.status(201).json(newDevice);
	} catch (err: any) {
		let message =
			"Error while registering device: " +
			(err instanceof Error ? err.message : err);
		Log.error(message);
		res.status(500).send(message);
	}
}

async function deleteDevice(req: Request, res: Response) {
	res.status(501).send("Not implemented");
}

async function putDevice(req: Request<{}, {}, Device>, res: Response) {
	res.status(501).send("Not implemented");
}

export default {
	getDevices,
	getDevice,
	postDevice,
	deleteDevice,
	putDevice
};
