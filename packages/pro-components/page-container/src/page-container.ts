import type { CSSProperties } from "vue";
import type { PageHeaderProps } from "../../page-header";

export interface PageContainerProps extends PageHeaderProps {
  loading?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  bodyClass?: string;
  bodyStyle?: CSSProperties;
}
