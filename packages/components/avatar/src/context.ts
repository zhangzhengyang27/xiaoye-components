import type { InjectionKey, Ref } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import type { AvatarShape } from "./avatar";

export interface AvatarGroupContext {
  size: Ref<number | ComponentSize | undefined>;
  shape: Ref<AvatarShape | undefined>;
}

export const avatarGroupContextKey: InjectionKey<AvatarGroupContext> = Symbol(
  "xiaoye-avatar-group"
);
