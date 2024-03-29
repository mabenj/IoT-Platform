import axios from "axios";
import { Device } from "../../../interfaces/device.interface";

async function getAllDevices(): Promise<Device[]> {
    const response = await axios.get<Device[]>("/api/devices");
    return response.data.map((device) => ({
        ...device,
        createdAt: new Date(device.createdAt!),
        updatedAt: new Date(device.updatedAt!)
    }));
}

async function getDevice(deviceId: string): Promise<Device> {
    const { data } = await axios.get<Device>(`/api/devices/${deviceId}`);
    return {
        ...data,
        createdAt: new Date(data.createdAt!),
        updatedAt: new Date(data.updatedAt!)
    };
}

async function registerDevice(device: Device) {
    const response = await axios.post<Device>("/api/devices", device);
    return response?.data;
}

async function deleteDevice(deviceId: string) {
    const response = await axios.delete(`/api/devices/${deviceId}`);
    return response.data;
}

async function modifyDevice(device: Device) {
    const response = await axios.put<Device>(
        `/api/devices/${device.id}`,
        device
    );
    return response.data;
}

const DeviceService = {
    getAllDevices,
    registerDevice,
    deleteDevice,
    modifyDevice,
    getDevice
};

export default DeviceService;
