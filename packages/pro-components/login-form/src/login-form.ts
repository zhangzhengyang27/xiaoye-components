import type { FormRules } from "@xiaoye/components";

export interface LoginFormModel {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginFormThirdPartyItem {
  key: string;
  label: string;
  icon?: string;
}

export interface LoginFormProps {
  model: LoginFormModel;
  title?: string;
  description?: string;
  loading?: boolean;
  disabled?: boolean;
  submitText?: string;
  showRemember?: boolean;
  rememberLabel?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  rules?: FormRules;
  thirdPartyItems?: LoginFormThirdPartyItem[];
}

export interface LoginFormInstance {
  validate: () => Promise<boolean>;
  submit: () => Promise<boolean>;
  focus: (field?: "username" | "password") => void;
}
