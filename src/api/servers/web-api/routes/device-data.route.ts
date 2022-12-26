import { Router } from "express";
import DeviceDataController from "../controllers/device-data.controller";

const router = Router();

router.get("/:deviceId", DeviceDataController.getDeviceData);
router.get("/:deviceId/timeSeries", DeviceDataController.getDeviceTimeSeries);
router.get("/:deviceId/exportJson", DeviceDataController.exportDeviceDataJson);
router.delete("/:deviceId", DeviceDataController.deleteDeviceData);

export default router;
