<script setup lang="ts">
import { computed } from "vue";
import type { TagProps } from "../../tag";
import { useConfig, useNamespace } from "@xiaoye/primitives";
import XyAvatar from "../../avatar";
import XyIcon from "../../icon";
import XyTag from "../../tag";
import type { CheckCardProps, CheckCardTag } from "./check-card";

defineOptions({
  name: "XyCheckCard"
});

const props = withDefaults(defineProps<CheckCardProps>(), {
  modelValue: false,
  size: undefined,
  disabled: false,
  title: "",
  description: "",
  extra: "",
  avatar: undefined,
  tag: undefined,
  ariaLabel: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [value: boolean];
  extra: [];
}>();

const slots = defineSlots<{
  avatar?: (scope: {
    checked: boolean;
    disabled: boolean;
    title: string;
    description: string;
    extra: string;
    avatar?: CheckCardProps["avatar"];
    tag?: CheckCardProps["tag"];
  }) => unknown;
  title?: (scope: {
    checked: boolean;
    disabled: boolean;
    title: string;
    description: string;
    extra: string;
    avatar?: CheckCardProps["avatar"];
    tag?: CheckCardProps["tag"];
  }) => unknown;
  tag?: (scope: {
    checked: boolean;
    disabled: boolean;
    title: string;
    description: string;
    extra: string;
    avatar?: CheckCardProps["avatar"];
    tag?: CheckCardProps["tag"];
  }) => unknown;
  description?: (scope: {
    checked: boolean;
    disabled: boolean;
    title: string;
    description: string;
    extra: string;
    avatar?: CheckCardProps["avatar"];
    tag?: CheckCardProps["tag"];
  }) => unknown;
  extra?: (scope: {
    checked: boolean;
    disabled: boolean;
    title: string;
    description: string;
    extra: string;
    avatar?: CheckCardProps["avatar"];
    tag?: CheckCardProps["tag"];
  }) => unknown;
}>();

const ns = useNamespace("check-card");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);

const scope = computed(() => ({
  checked: props.modelValue,
  disabled: props.disabled,
  title: props.title,
  description: props.description,
  extra: props.extra,
  avatar: props.avatar,
  tag: props.tag
}));

const hasAvatar = computed(
  () =>
    Boolean(slots.avatar) ||
    Boolean(
      props.avatar &&
        (props.avatar.text ||
          props.avatar.icon ||
          props.avatar.src ||
          props.avatar.srcSet)
    )
);
const hasTitle = computed(() => Boolean(slots.title) || Boolean(props.title));
const hasTag = computed(() => Boolean(slots.tag) || Boolean(props.tag));
const hasDescription = computed(() => Boolean(slots.description) || Boolean(props.description));
const hasExtra = computed(() => Boolean(slots.extra) || Boolean(props.extra));
const hasHeader = computed(() => hasTitle.value || hasTag.value || hasExtra.value);

const cardClasses = computed(() => [
  ns.base.value,
  mergedSize.value ? `${ns.base.value}--${mergedSize.value}` : "",
  ns.is("checked", props.modelValue),
  ns.is("disabled", props.disabled),
  ns.is("with-avatar", hasAvatar.value),
  ns.is("with-description", hasDescription.value)
]);

const indicatorIconSizeMap = Object.freeze({
  sm: 14,
  md: 16,
  lg: 18
}) as Readonly<Record<string, number>>;

const indicatorIconSize = computed(() => indicatorIconSizeMap[mergedSize.value] ?? 16);

function resolveTagText(tag: string | CheckCardTag | undefined) {
  if (!tag) {
    return "";
  }

  return typeof tag === "string" ? tag : tag.text;
}

function resolveTagProps(tag: string | CheckCardTag | undefined) {
  if (!tag || typeof tag === "string") {
    return undefined;
  }

  return tag.props as Partial<TagProps> | undefined;
}

function handleToggle() {
  if (props.disabled) {
    return;
  }

  const nextValue = !props.modelValue;
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  handleToggle();
}

function handleExtraClick() {
  if (props.disabled) {
    return;
  }

  emit("extra");
}
</script>

<template>
  <div
    :class="cardClasses"
    :tabindex="props.disabled ? -1 : 0"
    role="checkbox"
    :aria-checked="props.modelValue"
    :aria-disabled="props.disabled || undefined"
    :aria-label="props.ariaLabel || props.title || 'check-card'"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <div class="xy-check-card__indicator" aria-hidden="true">
      <XyIcon icon="mdi:check" :size="indicatorIconSize" />
    </div>

    <div v-if="hasAvatar" class="xy-check-card__avatar">
      <slot name="avatar" v-bind="scope">
        <XyAvatar
          v-bind="{
            size: props.avatar?.size ?? mergedSize,
            shape: props.avatar?.shape,
            icon: props.avatar?.icon,
            src: props.avatar?.src,
            alt: props.avatar?.alt,
            srcSet: props.avatar?.srcSet,
            fit: props.avatar?.fit
          }"
        >
          {{ props.avatar?.text }}
        </XyAvatar>
      </slot>
    </div>

    <div class="xy-check-card__content">
      <div v-if="hasHeader" class="xy-check-card__header">
        <div class="xy-check-card__header-main">
          <div v-if="hasTitle" class="xy-check-card__title">
            <slot name="title" v-bind="scope">{{ props.title }}</slot>
          </div>

          <div v-if="hasTag" class="xy-check-card__tag">
            <slot name="tag" v-bind="scope">
              <XyTag size="sm" v-bind="resolveTagProps(props.tag)">{{ resolveTagText(props.tag) }}</XyTag>
            </slot>
          </div>
        </div>

        <button
          v-if="hasExtra"
          class="xy-check-card__extra"
          type="button"
          :disabled="props.disabled"
          @click.stop="handleExtraClick"
        >
          <slot name="extra" v-bind="scope">{{ props.extra }}</slot>
        </button>
      </div>

      <div v-if="hasDescription" class="xy-check-card__description">
        <slot name="description" v-bind="scope">{{ props.description }}</slot>
      </div>
    </div>
  </div>
</template>
