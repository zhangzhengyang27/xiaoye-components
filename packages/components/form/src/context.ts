import type { InjectionKey, Ref } from "vue";
import type { RuleItem } from "async-validator";
import type { ComponentSize } from "@xiaoye/utils";
import type { FormProp } from "./utils";

export type FormTrigger = "blur" | "change";
export type ValidateState = "idle" | "validating" | "success" | "error";

export interface XyFormRule extends RuleItem {
  required?: boolean;
  trigger?: FormTrigger | FormTrigger[];
}

export type FormRules = Record<string, XyFormRule[]>;

export interface FormFieldContext {
  prop?: string;
  propKey?: string;
  element?: HTMLElement | null;
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
  inline?: boolean;
  disabled?: boolean;
  scrollToError?: boolean;
  validateOnRuleChange?: boolean;
}

export interface FormContext {
  props: FormProps;
  addField: (field: FormFieldContext) => void;
  removeField: (field: FormFieldContext) => void;
  resetFields: (props?: FormProp | FormProp[]) => void;
}

export interface FormItemContext {
  prop?: FormProp;
  inputId: string;
  messageId: string;
  message: Ref<string>;
  validateState: Ref<ValidateState>;
  disabled: Ref<boolean>;
  validate: (trigger?: FormTrigger) => Promise<boolean>;
  clearValidate: () => void;
}

export const formKey: InjectionKey<FormContext> = Symbol("xiaoye-form");
export const formItemKey: InjectionKey<FormItemContext> = Symbol("xiaoye-form-item");
