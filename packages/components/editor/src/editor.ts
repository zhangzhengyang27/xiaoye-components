import type Vditor from "vditor";

export interface EditorOptions {
  [key: string]: unknown;
}

export interface EditorProps {
  modelValue?: string;
  options?: EditorOptions;
  placeholder?: string;
  height?: string | number;
  minHeight?: string | number;
  disabled?: boolean;
}

export interface EditorInstance {
  editor: Vditor | null;
  getValue: () => string;
  setValue: (value: string, clearStack?: boolean) => void;
  focus: () => void;
}
