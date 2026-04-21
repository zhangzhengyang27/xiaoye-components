export type LinkType = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type LinkUnderline = "always" | "hover" | "never";

export interface LinkProps {
  type?: LinkType;
  underline?: LinkUnderline;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export type LinkInstance = InstanceType<import("./link.vue").default>;
