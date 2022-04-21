import { Router } from "express";
import DeviceController from "../controllers/device.controller";

const router = Router();

router.get("/", DeviceController.getDevices);
router.get("/:id", DeviceController.getDevice);
router.post("/", DeviceController.postDevice);
router.put("/:id", DeviceController.putDevice);
router.delete("/:id", DeviceController.deleteDevice);

export default router;
