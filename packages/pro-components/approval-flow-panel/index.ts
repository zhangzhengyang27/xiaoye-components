import ApprovalFlowPanel from "./src/approval-flow-panel.vue";
import type {
  ApprovalFlowNode,
  ApprovalFlowPanelProps
} from "./src/approval-flow-panel";
import { withInstall } from "@xiaoye/utils";

export type { ApprovalFlowNode, ApprovalFlowPanelProps };

export const XyApprovalFlowPanel = withInstall(
  ApprovalFlowPanel,
  "xy-approval-flow-panel"
);

export default XyApprovalFlowPanel;
