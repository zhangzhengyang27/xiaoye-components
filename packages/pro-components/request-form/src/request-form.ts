import type { FormRules } from "@xiaoye/components";
import type { ComponentSize } from "@xiaoye/utils";
import type { ProActionRef, ProFieldSchema, ProRequestContext } from "../../core";

export interface RequestFormSubmitContext extends ProRequestContext {
  model: Record<string, unknown>;
}

export interface RequestFormProps {
  title?: string;
  description?: string;
  model: Record<string, unknown>;
  schema?: ProFieldSchema[];
  rules?: FormRules;
  labelWidth?: string | number;
  labelPosition?: "left" | "top";
  size?: ComponentSize;
  immediate?: boolean;
  initialRequest?: (ctx: ProRequestContext) => Promise<Record<string, unknown>>;
  submitRequest?: (ctx: RequestFormSubmitContext) => Promise<unknown>;
}

export interface RequestFormInstance extends ProActionRef {
  submit: () => Promise<boolean>;
}
