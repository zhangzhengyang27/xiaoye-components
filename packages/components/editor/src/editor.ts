import type Vditor from "vditor";

export interface EditorOptions {
  [key: string]: unknown;
}

export type EditorModelValueChangeHandler = (value: string) => void;
export type EditorInstanceHandler = (editor: NonNullable<EditorInstance["editor"]>) => void;
export type EditorFocusHandler = () => void;
export type EditorBlurHandler = (value: string) => void;

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
