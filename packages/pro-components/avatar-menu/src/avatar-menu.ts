import type { AvatarProps, DropdownCommand, DropdownItem, DropdownProps } from "@xiaoye/components";

export interface AvatarMenuItem extends DropdownItem {}

export interface AvatarMenuProps {
  username?: string;
  description?: string;
  items?: AvatarMenuItem[];
  dropdownProps?: Partial<DropdownProps>;
  avatarProps?: Partial<AvatarProps>;
}

export type AvatarMenuCommand = DropdownCommand | string | undefined;
