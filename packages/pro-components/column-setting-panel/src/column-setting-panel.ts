export interface ColumnSettingPanelColumn {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ColumnSettingPanelProps {
  title?: string;
  description?: string;
  columns: ColumnSettingPanelColumn[];
  modelValue: string[];
}
