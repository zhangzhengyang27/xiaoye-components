import type {
  ApprovalFlowNode,
  ApprovalFlowPanelProps,
  ProPageAction
} from "@xiaoye/pro-components";

const nodes: ApprovalFlowNode[] = [
  {
    key: "review",
    title: "审批中",
    status: "process"
  }
];

const actions: ProPageAction[] = [
  {
    key: "approve",
    label: "通过",
    type: "primary"
  }
];

const props: ApprovalFlowPanelProps = {
  nodes,
  actions
};

void nodes;
void actions;
void props;
