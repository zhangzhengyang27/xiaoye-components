import type { AvatarProps, DropdownCommand, DropdownItem, DropdownProps } from "@xiaoye/components";

export type AvatarMenuItem = DropdownItem;

export interface AvatarMenuProps {
  username?: string;
  description?: string;
  items?: AvatarMenuItem[];
  dropdownProps?: Partial<DropdownProps>;
  avatarProps?: Partial<AvatarProps>;
}

export type AvatarMenuCommand = DropdownCommand | string | undefined;
