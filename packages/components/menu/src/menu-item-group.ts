export interface MenuItemGroupProps {
  title?: string;
}

export const menuItemGroupProps = {
  title: {
    type: String,
    default: ""
  }
} as const;
