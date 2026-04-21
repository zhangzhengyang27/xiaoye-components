import Descriptions from "./src/descriptions.vue";
import DescriptionsItem from "./src/descriptions-item.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type {
  DescriptionsDataItem,
  DescriptionsDataTag,
  DescriptionsDisplayOption,
  DescriptionsDisplayOptionGroup,
  DescriptionsProps
} from "./src/descriptions";
import type { DescriptionsItemProps } from "./src/descriptions-item.vue";

export type {
  DescriptionsDataItem,
  DescriptionsDataTag,
  DescriptionsDisplayOption,
  DescriptionsDisplayOptionGroup,
  DescriptionsItemProps,
  DescriptionsProps
};

export const XyDescriptionsItem = withInstall(DescriptionsItem, "xy-descriptions-item");

export const XyDescriptions = withInstall(Descriptions, "xy-descriptions") as SFCWithInstall<
  typeof Descriptions
> & {
  Item: typeof XyDescriptionsItem;
};

XyDescriptions.Item = XyDescriptionsItem;

export default XyDescriptions;
