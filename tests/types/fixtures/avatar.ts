import type {
  AvatarGroupItem,
  AvatarGroupProps,
  AvatarProps,
  AvatarShape
} from "xiaoye-components";

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
  items: [
    {
      key: "xiaoye",
      text: "叶",
      icon: "mdi:account-outline"
    }
  ],
  direction: "vertical",
  gutter: 12,
  reverse: true,
  inline: false,
  collapseAvatars: true,
  collapseAvatarsTooltip: true,
  maxCollapseAvatars: 2,
  placement: "bottom",
  collapseClass: "custom-collapse"
};

void avatarGroupProps;

const avatarGroupItem: AvatarGroupItem = {
  key: "member-1",
  text: "小叶",
  src: "https://example.com/avatar.png",
  icon: "mdi:account-outline",
  className: "avatar-item"
};

void avatarGroupItem;

const invalidPlacement: AvatarGroupProps = {
  // @ts-expect-error invalid placement should be rejected
  placement: "center"
};

void invalidPlacement;
