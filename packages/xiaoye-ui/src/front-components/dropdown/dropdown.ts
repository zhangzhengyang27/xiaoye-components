export type DropdownTrigger = "hover" | "click" | "contextmenu";
export type DropdownPlacement = "top" | "bottom" | "left" | "right";

export interface DropdownProps {
  trigger?: DropdownTrigger;
  placement?: DropdownPlacement;
  disabled?: boolean;
}

export interface DropdownMenuItem {
  label: string;
  key: string;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
}

export interface DropdownProps {
  items?: DropdownMenuItem[];
  trigger?: DropdownTrigger;
  placement?: DropdownPlacement;
  disabled?: boolean;
}

export type DropdownInstance = InstanceType<import("./dropdown.vue").default>;
