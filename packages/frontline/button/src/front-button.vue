<script setup lang="ts">
import { computed, watchEffect, useSlots } from "vue";
import { XyButton, XyIcon } from "@xiaoye/components";
import type { ButtonType } from "@xiaoye/components/button/src/button";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontButtonProps } from "./button";
import { FrontSlot } from "../../shared/slot";

const props = withDefaults(defineProps<FrontButtonProps>(), {
  variant: "solid",
  tone: "brand",
  size: "md",
  loading: false,
  disabled: false,
  block: false,
  leadingIcon: "",
  trailingIcon: "",
  asChild: false,
  tag: "button",
  nativeType: "button"
});
const slots = useSlots();

const buttonType = computed<ButtonType>(() => {
  if (props.tone === "neutral") {
    return "default";
  }

  if (props.tone === "brand") {
    return "primary";
  }

  return props.tone;
});

const buttonClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-button",
  `xy-frontline-button--${props.variant}`,
  `xy-frontline-button--${props.tone}`
]);
const isPlain = computed(() => props.variant === "soft" || props.variant === "outline");
const isText = computed(() => props.variant === "ghost");
const buttonState = computed(() => (props.loading ? "loading" : props.disabled ? "disabled" : "idle"));
const resolvedTag = computed(() => (props.asChild ? FrontSlot : props.tag));

if (isDev()) {
  watchEffect(() => {
    if (slots.prefix && !slots.leading) {
      warnOnce("XyFrontButton", "`prefix` slot 已降级，后续请改用 `leading`。");
    }

    if (slots.suffix && !slots.trailing) {
      warnOnce("XyFrontButton", "`suffix` slot 已降级，后续请改用 `trailing`。");
    }
  });
}
</script>

<template>
  <XyButton
    :class="buttonClass"
    :type="buttonType"
    :size="props.size"
    :loading="props.loading"
    :disabled="props.disabled"
    :plain="isPlain"
    :text="isText"
    :bg="isText"
    :block="props.block"
    :tag="resolvedTag"
    :native-type="props.nativeType"
    :data-slot="'trigger'"
    :data-state="buttonState"
    :data-variant="props.variant"
    :data-tone="props.tone"
    :data-size="props.size"
    :aria-busy="props.loading ? 'true' : undefined"
  >
    <template v-if="props.leadingIcon || $slots.leading || $slots.prefix" #prefix>
      <slot name="leading" :state="buttonState">
        <slot name="prefix" :state="buttonState">
          <XyIcon v-if="props.leadingIcon" :icon="props.leadingIcon" />
        </slot>
      </slot>
    </template>
    <slot />
    <template v-if="props.trailingIcon || $slots.trailing || $slots.suffix" #suffix>
      <slot name="trailing" :state="buttonState">
        <slot name="suffix" :state="buttonState">
          <XyIcon v-if="props.trailingIcon" :icon="props.trailingIcon" />
        </slot>
      </slot>
    </template>
  </XyButton>
</template>

<style scoped>
.xy-frontline-button {
  --xy-button-font-weight: 700;
  border-radius: var(--xy-frontline-radius-lg);
  letter-spacing: -0.01em;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease;
}

.xy-frontline-button:hover:not(.is-disabled):not(.is-loading) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
}

.xy-frontline-button:deep(.xy-button__label) {
  font-weight: 700;
}

.xy-frontline-button--solid.xy-frontline-button--brand {
  background:
    linear-gradient(135deg, var(--xy-frontline-brand-1), var(--xy-frontline-brand-2));
  border-color: transparent;
}

.xy-frontline-button--solid.xy-frontline-button--brand:hover:not(.is-disabled):not(.is-loading) {
  background:
    linear-gradient(135deg, #0f56e5, #4da6ff);
}

.xy-frontline-button--solid.xy-frontline-button--neutral {
  background: linear-gradient(135deg, #0f172a, #334155);
  border-color: transparent;
}

.xy-frontline-button--soft {
  background: var(--xy-frontline-brand-3);
  border-color: rgba(20, 99, 255, 0.14);
}

.xy-frontline-button--soft.xy-frontline-button--neutral {
  background: rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.08);
  color: var(--xy-frontline-neutral-1);
}

.xy-frontline-button--outline {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(15, 23, 42, 0.14);
  color: var(--xy-frontline-neutral-1);
  box-shadow: none;
}

.xy-frontline-button--ghost {
  background: transparent;
  color: var(--xy-frontline-neutral-2);
  box-shadow: none;
}
</style>
