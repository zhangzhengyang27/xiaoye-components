import type { ProPageAction } from "../../core";

export interface ApprovalFlowNode {
  key: string;
  title: string;
  status?: "wait" | "process" | "finish" | "error" | "success";
  assignee?: string;
  time?: string;
  description?: string;
}

export type ApprovalFlowAction = ProPageAction;

export interface ApprovalFlowPanelProps {
  title?: string;
  nodes: ApprovalFlowNode[];
  actions?: ApprovalFlowAction[];
}
