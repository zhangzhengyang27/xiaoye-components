export interface ExportTaskItem {
  id: string | number;
  name: string;
  status: "waiting" | "processing" | "success" | "error";
  progress?: number;
  createdAt?: string;
  url?: string;
}

export interface ExportTaskPanelProps {
  title?: string;
  tasks: ExportTaskItem[];
}
