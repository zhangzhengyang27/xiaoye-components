export interface ListboxOptionData {
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface ListboxRootProps {
  modelValue?: string | number | ListboxOptionData | null;
  options?: ListboxOptionData[];
  disabled?: boolean;
  placement?: string;
  offset?: number;
}
