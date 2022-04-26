import Home from "../components/Home";
import NotFound from "../components/NotFound";
import RegisterDevice from "../components/RegisterDevice";
import ViewDevice from "../components/ViewDevice";
import ViewDevices from "../components/ViewDevices";

const Routes = [
	{ path: "/", breadcrumb: "Home", isIndex: true, Component: Home },
	{ path: "/home", breadcrumb: "Home", Component: Home },
	{ path: "/viewDevices", breadcrumb: "View Devices", Component: ViewDevices },
	{
		path: "/viewDevices/:deviceId",
		breadcrumb: "Device Configuration",
		Component: ViewDevice
	},
	{
		path: "/registerDevice",
		breadcrumb: "Register Device",
		Component: RegisterDevice
	},
	{ path: "*", breadcrumb: "Not found", Component: NotFound }
];

export default Routes;
