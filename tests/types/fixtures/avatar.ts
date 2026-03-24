import type { AvatarGroupProps, AvatarProps, AvatarShape } from "xiaoye-components";

const shape: AvatarShape = "circle";

const avatarProps: AvatarProps = {
  size: 48,
  shape,
  icon: "mdi:account-outline",
  src: "https://example.com/avatar.png",
  alt: "avatar",
  srcSet: "https://example.com/avatar.png 1x, https://example.com/avatar@2x.png 2x",
  fit: "cover"
};

void avatarProps;

const invalidShape: AvatarProps = {
  // @ts-expect-error invalid shape should be rejected
  shape: "rounded"
};

void invalidShape;

const invalidFit: AvatarProps = {
  // @ts-expect-error invalid fit should be rejected
  fit: "crop"
};

void invalidFit;

const avatarGroupProps: AvatarGroupProps = {
  size: "lg",
  shape: "square",
  collapseAvatars: true,
  collapseAvatarsTooltip: true,
  maxCollapseAvatars: 2,
  placement: "bottom",
  collapseClass: "custom-collapse"
};

void avatarGroupProps;

const invalidPlacement: AvatarGroupProps = {
  // @ts-expect-error invalid placement should be rejected
  placement: "bottom-start"
};

void invalidPlacement;
