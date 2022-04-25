import NotFound from "../components/app/NotFound";
import Home from "../components/home/Home";
import RegisterDevice from "../components/register-device/RegisterDevice";
import DeviceConfiguration from "../components/view-devices/DeviceConfiguration";
import ViewDevices from "../components/view-devices/ViewDevices";

const Routes = [
	{ path: "/", breadcrumb: "Home", isIndex: true, Component: Home },
	{ path: "/viewDevices", breadcrumb: "View Devices", Component: ViewDevices },
	{
		path: "/viewDevices/:deviceId",
		breadcrumb: "Device Configuration",
		Component: DeviceConfiguration
	},
	{
		path: "/registerDevice",
		breadcrumb: "Register Device",
		Component: RegisterDevice
	},
	{ path: "*", breadcrumb: "Not found", Component: NotFound }
];

export default Routes;
