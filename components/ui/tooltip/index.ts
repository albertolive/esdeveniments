import { Tooltip } from "react-tooltip";

export default function TooltipComponent({ id, children }) {
  return <Tooltip id={id}>{children}</Tooltip>;
}
