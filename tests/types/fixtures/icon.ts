import type { IconProps } from "xiaoye-components";
// @ts-expect-error BuiltinIconName has been removed after switching to Iconify
import type { BuiltinIconName } from "xiaoye-components";

const props: IconProps = {
  icon: "mdi:magnify",
  size: 16,
  rotate: 90,
  spin: true
};

void props;

// @ts-expect-error icon is required
const invalidMissingIcon: IconProps = {
  size: 16
};

void invalidMissingIcon;

const invalidLegacyName: IconProps = {
  icon: "mdi:magnify",
  // @ts-expect-error legacy name prop has been removed
  name: "search"
};

void invalidLegacyName;

void (0 as unknown as BuiltinIconName);
