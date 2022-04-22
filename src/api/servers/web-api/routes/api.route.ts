import { Router } from "express";
import DeviceRoutes from "./device.route";
import DeviceDataRoutes from "./device-data.route";

const router = Router();

router.use("/devices", DeviceRoutes);
router.use("/deviceData", DeviceDataRoutes);

export default router;
