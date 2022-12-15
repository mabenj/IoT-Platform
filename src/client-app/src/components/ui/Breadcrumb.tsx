import BootstrapBreadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import Routes from "../../routes/routes";

export default function Breadcrumb() {
    const breadcrumbs = useBreadcrumbs(Routes);

    if (breadcrumbs.length <= 1) {
        return <></>;
    }

    return (
        <BootstrapBreadcrumb>
            {breadcrumbs.map((breadcrumbData, index) => {
                const isActive =
                    breadcrumbData.location.pathname ===
                    breadcrumbData.match.pathname;
                return (
                    <BootstrapBreadcrumb.Item
                        linkAs="span"
                        key={index}
                        active={isActive}>
                        {isActive ? (
                            breadcrumbData.breadcrumb
                        ) : (
                            <Link
                                to={breadcrumbData.key}
                                className="hover-underline">
                                {breadcrumbData.breadcrumb}
                            </Link>
                        )}
                    </BootstrapBreadcrumb.Item>
                );
            })}
        </BootstrapBreadcrumb>
    );
}
