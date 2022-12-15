import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface HoverTooltipProps {
    placement?: "top" | "bottom" | "right" | "left";
    children: JSX.Element;
    tooltip?: string;
}

export default function HoverTooltip({
    placement = "top",
    children,
    tooltip
}: HoverTooltipProps) {
    if (!tooltip) {
        return children;
    }
    return (
        <OverlayTrigger
            trigger={["hover", "focus"]}
            placement={placement}
            overlay={(props) => <Tooltip {...props}>{tooltip}</Tooltip>}>
            {children}
        </OverlayTrigger>
    );
}
