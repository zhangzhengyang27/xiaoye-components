import type { DropdownCommand } from "./dropdown";

export interface DropdownItemProps {
  command?: DropdownCommand;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
  danger?: boolean;
  description?: string;
  textValue?: string;
}
