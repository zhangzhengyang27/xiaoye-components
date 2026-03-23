export const linkTypes = ["default", "primary", "success", "warning", "info", "danger"] as const;

export const linkUnderlineModes = ["always", "never", "hover"] as const;

export type LinkType = (typeof linkTypes)[number];
export type LinkUnderlineMode = (typeof linkUnderlineModes)[number];
export type LinkUnderline = boolean | LinkUnderlineMode;
export type LinkTarget = "_blank" | "_parent" | "_self" | "_top" | (string & NonNullable<unknown>);

export interface LinkProps {
  type?: LinkType;
  underline?: LinkUnderline;
  disabled?: boolean;
  href?: string;
  target?: LinkTarget;
  icon?: string;
}
