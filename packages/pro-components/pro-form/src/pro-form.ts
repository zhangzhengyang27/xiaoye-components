import type { ComponentSize } from "@xiaoye/utils";
import type { FormProp, FormRules } from "@xiaoye/components";
import type { ProFieldSchema } from "../../core";

export interface ProFormProps {
  title?: string;
  description?: string;
  model: Record<string, unknown>;
  schema?: ProFieldSchema[];
  rules?: FormRules;
  labelWidth?: string | number;
  labelPosition?: "left" | "top";
  size?: ComponentSize;
  columns?: number;
  loading?: boolean;
  readonly?: boolean;
  submitting?: boolean;
  submitText?: string;
  resetText?: string;
  showSubmit?: boolean;
  showReset?: boolean;
}

export interface ProFormInstance {
  validate: () => Promise<boolean>;
  submit: () => Promise<boolean>;
  reset: (prop?: FormProp | FormProp[]) => void;
  clearValidate: (prop?: FormProp | FormProp[]) => void;
}
