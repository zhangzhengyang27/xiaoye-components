import type { VNodeChild } from "vue";
import type { ButtonType, SelectOptionGroup } from "@xiaoye/components";
import type { ComponentStatus, SelectOption } from "@xiaoye/primitives";

export interface ProRequestData<T = Record<string, unknown>> {
  data: T[];
  total?: number;
  extra?: Record<string, unknown>;
}

export type ProRequestResult<T = Record<string, unknown>> = T[] | ProRequestData<T>;

export interface ProRequestContext {
  action: string;
  params: Record<string, unknown>;
  page: number;
  pageSize: number;
  signal?: AbortSignal;
}

export interface ProActionRef {
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => Promise<void>;
}

export type ProDisplayValueType =
  | "text"
  | "select"
  | "radio"
  | "checkbox"
  | "tag"
  | "progress"
  | "link"
  | "image"
  | "avatar"
  | "money"
  | "date"
  | "datetime"
  | "code"
  | "copy";

export interface ProDisplayOption<T = string | number> extends SelectOption<T> {
  status?: ComponentStatus | "info";
  color?: string;
}

export interface ProDisplayOptionGroup<T = string | number>
  extends Omit<SelectOptionGroup<T>, "options"> {
  options: ProDisplayOption<T>[];
}

export interface ProDisplayRenderContext<
  TRow = Record<string, unknown>,
  TColumn = unknown
> {
  row: TRow;
  column: TColumn;
  rowIndex: number;
}

export type ProDisplayFormatter<
  TRow = Record<string, unknown>,
  TColumn = unknown
> = (value: unknown, context: ProDisplayRenderContext<TRow, TColumn>) => unknown;

export type ProDisplayRenderer<
  TRow = Record<string, unknown>,
  TColumn = unknown
> = (value: unknown, context: ProDisplayRenderContext<TRow, TColumn>) => VNodeChild;

export type ProDisplayHtmlRenderer<
  TRow = Record<string, unknown>,
  TColumn = unknown
> = (value: unknown, context: ProDisplayRenderContext<TRow, TColumn>) => string;

export type ProFieldSchemaBuiltinComponent =
  | "input"
  | "textarea"
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
  | "auto-complete"
  | "transfer"
  | "avatar"
  | "image"
  | "progress"
  | "tag"
  | "timeline"
  | "tree"
  | "steps";

export type ProFieldSchemaOption<T = string | number> =
  | ProDisplayOption<T>
  | ProDisplayOptionGroup<T>;

export interface ProFieldSchema {
  prop: string;
  label: string;
  component?: ProFieldSchemaBuiltinComponent;
  valueType?: ProDisplayValueType;
  componentProps?: Record<string, unknown>;
  options?: ProFieldSchemaOption[];
  formatter?: ProDisplayFormatter<Record<string, unknown>, ProFieldSchema>;
  render?: ProDisplayRenderer<Record<string, unknown>, ProFieldSchema>;
  renderHTML?: ProDisplayHtmlRenderer<Record<string, unknown>, ProFieldSchema>;
  emptyValue?: string;
  slot?: string;
  span?: number;
  hidden?: boolean | ((model: Record<string, unknown>) => boolean);
  disabled?: boolean | ((model: Record<string, unknown>) => boolean);
  required?: boolean;
  help?: string;
  placeholder?: string;
}

export interface ProPageAction {
  key: string;
  label: string;
  type?: ButtonType;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  visible?: boolean;
}

export interface ProRequestActionRef extends ProActionRef {
  state: {
    loading: boolean;
    error: unknown;
  };
}
