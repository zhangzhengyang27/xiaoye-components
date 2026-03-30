import type { Component } from "vue";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";
import type { FormRules, SelectOptionGroup, XyFormRule } from "@xiaoye/components";

export type SearchFormFieldBuiltinComponent =
  | "input"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "radio"
  | "radio-button"
  | "radio-group"
  | "cascader"
  | "date-picker"
  | "time-picker"
  | "time-select"
  | "input-number"
  | "switch"
  | "transfer"
  | "avatar"
  | "image"
  | "progress"
  | "tag"
  | "timeline"
  | "tree"
  | "steps";

export type SearchFormFieldOption<T = string | number> = SelectOption<T> | SelectOptionGroup<T>;

export interface SearchFormField {
  prop: string;
  label: string;
  component?: SearchFormFieldBuiltinComponent | Component;
  componentProps?: Record<string, unknown>;
  options?: SearchFormFieldOption[];
  slot?: string;
  span?: number;
  hidden?: boolean | ((model: Record<string, unknown>) => boolean);
  disabled?: boolean | ((model: Record<string, unknown>) => boolean);
  collapsible?: boolean;
  rules?: XyFormRule[];
  required?: boolean;
  help?: string;
  placeholder?: string;
}

export interface SearchFormProps {
  model: Record<string, unknown>;
  fields: SearchFormField[];
  rules?: FormRules;
  labelWidth?: string | number;
  labelPosition?: "left" | "top";
  size?: ComponentSize;
  columns?: number;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  submitText?: string;
  resetText?: string;
  expandText?: string;
  collapseText?: string;
  showSubmit?: boolean;
  showReset?: boolean;
  submitOnReset?: boolean;
  validateOnSearch?: boolean;
}

export interface SearchFormInstance {
  validate: () => Promise<boolean>;
  submit: () => Promise<boolean>;
  reset: () => void;
  resetFields: () => void;
  clearValidate: () => void;
  toggleCollapse: (force?: boolean) => void;
}
