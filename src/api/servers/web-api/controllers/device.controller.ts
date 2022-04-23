import { Request, Response } from "express";
import { Device } from "../../../../interfaces/device.interface";
import DeviceService from "../../../services/device.service";

async function getDevices(req: Request, res: Response) {
	res.json(await DeviceService.getAllDevices());
}

async function getDevice(req: Request<{ id: string }>, res: Response) {
	res.json(await DeviceService.getDevice(req.params.id));
}

async function postDevice(req: Request<{}, {}, Device>, res: Response) {
	const newDevice = await DeviceService.addDevice(req.body);
	res.status(201).json(newDevice);
}

async function deleteDevice(req: Request<{ id: string }>, res: Response) {
	await DeviceService.removeDevice(req.params.id);
	res.status(204).send();
}

async function putDevice(
	req: Request<{ id: string }, {}, Device>,
	res: Response
) {
	const newDevice = await DeviceService.modifyDevice(req.params.id, req.body);
	res.status(201).json(newDevice);
}

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: typeof error === "string"
		? error
		: "Unknown error";
}

export default {
	getDevices,
	getDevice,
	postDevice,
	deleteDevice,
	putDevice
};
