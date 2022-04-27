import { Router } from "express";
import DeviceDataController from "../controllers/device-data.controller";

const router = Router();

router.get("/:deviceId", DeviceDataController.getDeviceData);
router.delete("/:deviceId", DeviceDataController.deleteDeviceData);

export default router;
