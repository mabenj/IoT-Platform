import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Device } from "../../../interfaces/device.interface";
import DeviceService from "../services/DeviceService";

interface LocationState {
  device: Device;
}

export default function ViewData() {
  const { deviceId } = useParams();
  const { state } = useLocation();
  const [device, setDevice] = useState<Device>();

  useEffect(() => {
    async function fetchDevice() {
      setDevice(await DeviceService.getDevice(deviceId || ""));
    }
    const deviceFromState = (state as LocationState)?.device;
    if (!deviceFromState) {
      fetchDevice();
    } else {
      setDevice(deviceFromState);
    }
  }, [deviceId, state]);

  return (
    <div>
      <h3>Device: {device?.name}</h3>
      <h3>Data:</h3>
      TODO: show device data here
    </div>
  );
}
