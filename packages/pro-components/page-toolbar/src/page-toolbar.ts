import type { CSSProperties } from "vue";

export interface PageToolbarProps {
  title?: string;
  description?: string;
  divider?: boolean;
  sticky?: boolean;
  offsetTop?: number;
  bordered?: boolean;
  style?: CSSProperties;
}
