<script setup lang="ts">
import { computed, ref } from "vue";
import type { ButtonProps } from "./button";

const props = withDefaults(defineProps<ButtonProps>(), {
  nativeType: "button",
  loading: false,
  disabled: false,
  plain: false,
  text: false,
  link: false,
  autofocus: false,
  round: false,
  circle: false,
  block: false,
  tag: "button"
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
  loading?: () => unknown;
  prefix?: () => unknown;
  suffix?: () => unknown;
}>();

const ns = "xyu-button";
const buttonRef = ref<HTMLElement | null>(null);

const resolvedSize = computed(() => props.size ?? "md");

const isDisabled = computed(() => props.disabled || props.loading);

const isLinkTag = computed(
  () => props.tag === "a" && typeof (props as Record<string, unknown>).href === "string"
);
const isLink = computed(() => props.link);
const isText = computed(() => !isLink.value && props.text);
const isPlain = computed(() => !isLink.value && !isText.value && props.plain);

const hasDefaultSlot = computed(() => Boolean(slots.default));
const hasPrefixSlot = computed(() => Boolean(slots.prefix || slots.icon));
const hasSuffixSlot = computed(() => Boolean(slots.suffix));
const isIconOnly = computed(
  () =>
    !hasDefaultSlot.value &&
    !hasSuffixSlot.value &&
    (!props.loading || !slots.loading)
);
const isCircle = computed(() => props.circle && isIconOnly.value);

const iconSizeMap: Record<string, number> = { sm: 14, md: 16, lg: 18 };

const iconSize = computed(() => iconSizeMap[resolvedSize.value] ?? 16);

const showLeadingIcon = computed<boolean>(
  () =>
    !props.loading &&
    (Boolean(props.icon) || hasPrefixSlot.value)
);

const buttonClasses = computed(() => [
  ns,
  `${ns}--${resolvedSize.value}`,
  props.type ? `${ns}--${props.type}` : `${ns}--default`,
  isDisabled.value ? "is-disabled" : "",
  props.loading ? "is-loading" : "",
  isPlain.value ? "is-plain" : "",
  isText.value ? "is-text" : "",
  isLink.value ? "is-link" : "",
  props.round ? "is-round" : "",
  isCircle.value ? "is-circle" : "",
  props.block ? "is-block" : "",
  isIconOnly.value ? "is-icon-only" : ""
]);

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click", event);
}

function handleKeydown(event: KeyboardEvent) {
  if (isLinkTag.value) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  if (isDisabled.value) return;
  buttonRef.value?.click();
}

defineExpose({
  ref: buttonRef,
  size: resolvedSize,
  type: computed(() => props.type ?? "default"),
  disabled: isDisabled
});
</script>

<template>
  <component
    :is="props.tag"
    :ref="(el) => { buttonRef = el as HTMLElement | null; }"
    :type="props.tag === 'button' ? props.nativeType : undefined"
    :disabled="props.tag === 'button' ? isDisabled : undefined"
    :autofocus="props.autofocus"
    :href="isLinkTag ? (props as Record<string, unknown>).href : undefined"
    :role="!isLinkTag && !isLink && props.tag !== 'button' ? 'button' : undefined"
    :tabindex="isDisabled ? -1 : 0"
    :class="buttonClasses"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <template v-if="props.loading">
      <slot v-if="slots.loading" name="loading" />
      <span v-else :class="`${ns}__icon ${ns}__icon--loading`">
        <svg
          :width="iconSize"
          :height="iconSize"
          viewBox="0 0 24 24"
          fill="none"
          class="xyu-spin"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            stroke-dasharray="31.4 31.4"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </template>
    <template v-else-if="showLeadingIcon">
      <span :class="`${ns}__icon`">
        <slot v-if="slots.prefix" name="prefix" />
        <slot v-else-if="slots.icon" name="icon" />
        <svg
          v-else-if="props.icon"
          :width="iconSize"
          :height="iconSize"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="props.icon" />
        </svg>
      </span>
    </template>
    <span v-if="hasDefaultSlot" :class="`${ns}__label`">
      <slot />
    </span>
    <span v-if="hasSuffixSlot" :class="`${ns}__icon ${ns}__icon--suffix`">
      <slot name="suffix" />
    </span>
  </component>
</template>
