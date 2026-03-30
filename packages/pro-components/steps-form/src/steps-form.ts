import type { ProFieldSchema } from "../../core";
import type { DrawerProps } from "@xiaoye/components";

export interface StepsFormStep {
  key: string;
  title: string;
  description?: string;
  schema?: ProFieldSchema[];
}

export interface StepsFormProps {
  model: Record<string, unknown>;
  steps: StepsFormStep[];
  placement?: "page" | "drawer";
  open?: boolean;
  title?: string;
  active?: number;
  defaultActive?: number;
  loading?: boolean;
  readonly?: boolean;
  submitting?: boolean;
  nextText?: string;
  prevText?: string;
  submitText?: string;
  drawerProps?: Omit<Partial<DrawerProps>, "modelValue" | "title">;
}

export interface StepsFormInstance {
  next: () => Promise<void>;
  prev: () => Promise<void>;
  submit: () => Promise<void>;
  close: () => void;
}
