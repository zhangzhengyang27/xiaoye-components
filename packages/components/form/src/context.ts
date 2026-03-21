import type { InjectionKey, Ref } from "vue";
import type { RuleItem } from "async-validator";
import type { ComponentSize } from "@xiaoye/utils";

export type FormTrigger = "blur" | "change";
export type ValidateState = "idle" | "validating" | "success" | "error";

export interface XyFormRule extends RuleItem {
  required?: boolean;
  trigger?: FormTrigger | FormTrigger[];
}

export type FormRules = Record<string, XyFormRule[]>;

export interface FormFieldContext {
  prop?: string;
  validate: (trigger?: FormTrigger) => Promise<boolean>;
  clearValidate: () => void;
  resetField: () => void;
}

export interface FormProps {
  model: Record<string, unknown>;
  rules?: FormRules;
  labelWidth?: string | number;
  labelPosition?: "left" | "top";
  size?: ComponentSize;
}

export interface FormContext {
  props: FormProps;
  addField: (field: FormFieldContext) => void;
  removeField: (field: FormFieldContext) => void;
}

export interface FormItemContext {
  prop?: string;
  inputId: string;
  messageId: string;
  message: Ref<string>;
  validateState: Ref<ValidateState>;
  validate: (trigger?: FormTrigger) => Promise<boolean>;
  clearValidate: () => void;
}

export const formKey: InjectionKey<FormContext> = Symbol("xiaoye-form");
export const formItemKey: InjectionKey<FormItemContext> = Symbol("xiaoye-form-item");
