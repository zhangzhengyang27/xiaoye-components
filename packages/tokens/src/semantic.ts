import { primitiveTokens } from "./primitives";

export const semanticTokens = {
  colorPrimary: primitiveTokens.color.brand["500"],
  colorPrimaryHover: primitiveTokens.color.brand["600"],
  colorSuccess: primitiveTokens.color.success,
  colorWarning: primitiveTokens.color.warning,
  colorDanger: primitiveTokens.color.danger,
  colorText: primitiveTokens.color.slate["800"],
  colorTextSecondary: primitiveTokens.color.slate["500"],
  colorBorder: primitiveTokens.color.slate["200"],
  colorBorderStrong: primitiveTokens.color.slate["300"],
  colorBg: "#ffffff",
  colorBgMuted: primitiveTokens.color.slate["50"],
  colorBgElevated: "#ffffff",
  colorOverlay: "rgba(15, 23, 42, 0.56)",
  radius: primitiveTokens.radius.md,
  fontSize: primitiveTokens.fontSize.md,
  shadow: primitiveTokens.shadow.md
} as const;
