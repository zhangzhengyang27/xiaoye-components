import { toRaw, type Component } from "vue";
import {
  XyAutoComplete,
  XyAvatar,
  XyCascader,
  XyCheckbox,
  XyCheckboxGroup,
  XyDatePicker,
  XyImage,
  XyInput,
  XyInputNumber,
  XyProgress,
  XyRadioGroup,
  XySelect,
  XySwitch,
  XyTag,
  XyTimePicker,
  XyTimeSelect,
  XyTimeline,
  XyTransfer,
  XyTree,
  XySteps
} from "@xiaoye/components";
import type { ProFieldSchema } from "./core";

const builtInComponentMap: Record<string, Component> = {
  input: XyInput,
  textarea: XyInput,
  select: XySelect,
  checkbox: XyCheckbox,
  "checkbox-group": XyCheckboxGroup,
  radio: XyRadioGroup,
  "radio-button": XyRadioGroup,
  "radio-group": XyRadioGroup,
  cascader: XyCascader,
  "date-picker": XyDatePicker,
  "time-picker": XyTimePicker,
  "time-select": XyTimeSelect,
  "input-number": XyInputNumber,
  switch: XySwitch,
  "auto-complete": XyAutoComplete,
  transfer: XyTransfer,
  avatar: XyAvatar,
  image: XyImage,
  progress: XyProgress,
  tag: XyTag,
  timeline: XyTimeline,
  tree: XyTree,
  steps: XySteps
};

export function cloneProValue<T>(value: T): T {
  const rawValue =
    value !== null && typeof value === "object" ? (toRaw(value) as T) : value;

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(rawValue);
  }

  return JSON.parse(JSON.stringify(rawValue)) as T;
}

export function resolveProFieldHidden(
  field: ProFieldSchema,
  model: Record<string, unknown>
) {
  return typeof field.hidden === "function" ? field.hidden(model) : field.hidden;
}

export function resolveProFieldDisabled(
  field: ProFieldSchema,
  model: Record<string, unknown>
) {
  return typeof field.disabled === "function" ? field.disabled(model) : field.disabled;
}

export function resolveProFieldComponent(field: ProFieldSchema) {
  if (!field.component) {
    return XyInput;
  }

  return builtInComponentMap[field.component] ?? XyInput;
}

export function resolveProFieldPlaceholder(field: ProFieldSchema) {
  if (field.placeholder) {
    return field.placeholder;
  }

  if (field.componentProps?.placeholder !== undefined) {
    return field.componentProps.placeholder;
  }

  const componentName = field.component ?? "input";
  const selectLike = [
    "select",
    "date-picker",
    "time-picker",
    "time-select",
    "auto-complete"
  ].includes(componentName);

  return `${selectLike ? "请选择" : "请输入"}${field.label}`;
}

export function resolveProFieldProps(field: ProFieldSchema) {
  const componentName = field.component ?? "input";
  const nextProps = {
    ...field.componentProps,
    placeholder: resolveProFieldPlaceholder(field)
  } as Record<string, unknown>;

  if (
    componentName === "select" ||
    componentName === "auto-complete" ||
    componentName === "checkbox-group" ||
    componentName === "radio-group"
  ) {
    nextProps.options = field.options ?? [];
  }

  if (componentName === "textarea") {
    nextProps.type = "textarea";
  }

  if (componentName === "radio-button") {
    nextProps.options = field.options ?? [];
    nextProps.type = "button";
  }

  return nextProps;
}

export function resolveProFieldSpan(field: ProFieldSchema, columns: number) {
  if (!field.span) {
    return 1;
  }

  return Math.max(1, Math.min(columns, Math.floor(field.span)));
}

export function updateProModelValue(
  model: Record<string, unknown>,
  prop: string,
  value: unknown
) {
  model[prop] = value;
}
