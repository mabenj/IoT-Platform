import { Router } from "express";
import DeviceDataController from "../controllers/device-data.controller";

const router = Router();

router.get("/:id", DeviceDataController.getDeviceData);
router.delete("/:id", DeviceDataController.deleteDeviceData);

export default router;
